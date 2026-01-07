import { TokenDto } from "@app/auth/commands/dto";
import { HttpException, Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import * as cookie from "cookie";
import { UnthorizedError } from "@error/application/user/user.error";
import { ConnectResult, ConnectRoomDto, DisconnectRoomDto } from "@app/room/commands/dto";
import { ConnectRoomUsecase, DisconnectRoomUsecase } from "@app/room/commands/usecase";


@Injectable()
export class SignalingWebsocketService {

  constructor(
    private readonly disconnectRoomUsecase : DisconnectRoomUsecase<any, any>,
    private readonly connectRoomUsecase : ConnectRoomUsecase<any, any>
  ) {}

  parseJwtToken( client : Socket ) : TokenDto {

    // access_token 파싱
    let access_token : string | undefined;
    const authHeader = client.handshake.headers.authorization;
    if ( typeof authHeader === "string" && authHeader.startsWith("Bearer ") ) {
      access_token = authHeader.slice(7).trim(); // Bearer 제거
    };

    // refresh_token 파싱
    let refresh_token : string | undefined;
    const cookieHeader : string | undefined = client.handshake.headers.cookie;
    if ( cookieHeader ) {
      const cookies = cookie.parse(cookieHeader);
      refresh_token = cookies["refresh_token"];
    };  

    if ( !access_token || !refresh_token ) throw new UnthorizedError("websocket에 핸드세이크중에 access_token 또는 refresh_token이 존재하지 않습니다.");

    return {
      access_token, refresh_token
    };
  }

  // ip를 파싱할때 사용하는 함수
  extractClientIp(client : Socket) : string {
    // nginx가 클라이언트의 원 IP를 전달하기 위해서 만든 헤더이다. ( 즉 Nginx가 집적 걸어줌 )
    const forwarded = client.handshake.headers['x-forwarded-for'];

    // 프록시 환경일때는 이 ip를 신뢰 
    if ( typeof forwarded === "string" ) {
      return forwarded.split(",")[0].trim();
    }

    // 그렇지 않은경우 그냥 ip주소 사용
    return client.handshake.address;
  };

  // 방에 나갈때 사용하는 함수
  async disconnectRoomService(dto : DisconnectRoomDto) : Promise<void> {
    await this.disconnectRoomUsecase.execute(dto);
  };

  // 방에 가입할때 사용하는 함수
  async joinRoomService( dto : ConnectRoomDto ) : Promise<ConnectResult> {
    try {
      const result : ConnectResult = await this.connectRoomUsecase.execute(dto);
      return result;
    } catch (err) {
      throw err;
    };
  };

};