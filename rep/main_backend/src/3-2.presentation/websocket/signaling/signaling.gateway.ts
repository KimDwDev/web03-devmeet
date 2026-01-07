// 시그널링 서버의 역할이라고 할 수 있을 것 같다.
import { Logger } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayInit, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io"
import { SignalingWebsocketService } from "./signaling.service";
import { TokenDto } from "@app/auth/commands/dto";
import { PayloadRes } from "@app/auth/queries/dto";
import { JwtWsGuard } from "../auth/guards/jwt.guard";
import { WEBSOCKET_AUTH_CLIENT_EVENT_NAME, WEBSOCKET_NAMESPACE } from "../websocket.constants";


@WebSocketGateway({
  namespace : WEBSOCKET_NAMESPACE.SIGNALING,
  cors : {
    origin : process.env.NODE_ALLOWED_ORIGIN?.split(",").map((origin) => origin.trim()),
    credentials : process.env.NODE_ALLOWED_CREDENTIALS === "true"
  },
  transports : ["websocket"],
  pingTimeout: 60 * 60 * 1000  // ping pong 허용 시간
})
export class SignalingWebsocketGateway implements OnGatewayInit {
  
  // 현재 websocket server를 명명
  @WebSocketServer()
  private readonly server : Server;

  // logger -> 나중에 winston으로 변경가능
  private readonly logger = new Logger();

  constructor(
    private readonly jwtGuard : JwtWsGuard,
    private readonly signalingService : SignalingWebsocketService,
  ) {}

  // onGatewayInit으로 websocket 연결됐을때 사용할 함수
  afterInit(server: Server) : void {
    this.logger.log("signaling websocket 서버 등록 되었습니다.");

    // 여기서 middleware를 추가할 수도 있다. ( 등록 후 연결 요청하면 이 미들웨어를 거친다. )
    server.use(async (socket, next) => {
      try {
        // http 핸드세이크 가정중 access_token, refresh_token 가져온후 검증
        const jwtToken : TokenDto = this.signalingService.parseJwtToken(socket);
        const payload : PayloadRes = await this.jwtGuard.execute(jwtToken);

        // 변경사항 클라이언트 전달
        socket.emit(WEBSOCKET_AUTH_CLIENT_EVENT_NAME.ACCESS_TOKEN, { access_token : payload.access_token });

        // payload 내용 저장
        socket.data.user = payload;

        // 계속 진행
        next();
      } catch (e) {
        // 핸드셰이크 차단
        this.logger.error(e);
        next(new Error("UNAUTHORIZED"));
      }
    });
  };

};