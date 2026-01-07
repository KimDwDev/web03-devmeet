import { TokenDto } from "@app/auth/commands/dto";
import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import * as cookie from "cookie";
import { UnthorizedError } from "@error/application/user/user.error";


@Injectable()
export class SignalingWebsocketService {

  constructor() {}

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

};