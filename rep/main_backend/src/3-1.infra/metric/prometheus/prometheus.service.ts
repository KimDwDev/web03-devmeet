import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { collectDefaultMetrics, Counter, Histogram, Registry } from "prom-client";


@Injectable()
export class PrometheusService {

  private readonly registry : Registry;
  // 요청 수
  readonly httpRequestsTotal: Counter<string>;
  // 지연시간
  readonly httpRequestDuration: Histogram<string>;
    
  constructor(
    config : ConfigService
  ) {
    this.registry = new Registry();

    // metrics를 모을때 기본적으로 붙이는 꼬리표
    this.registry.setDefaultLabels({
      service : config.get<string>("NODE_APP_PROMETHEUS_SERVICE_LABEL" , "main-backend"), // 어디 서비스인지 확인
      env : config.get<string>("NODE_APP_PROMETHEUS_SERVICE_ENV", "local") // 어느 환경인지 정한다.
    });

    // 기본적으로 현재 프로세스인 node 메트릭만 수집이 가능하다 ( CPU, 메모리, event loop등 )
    collectDefaultMetrics({
      register : this.registry,
      prefix : config.get<string>("NODE_APP_PROMETHEUS_DEFAULT_PREFIX", "main_backend_") // 기본 메트릭 앞에 붙는 이름
    });

    // 메트릭을 담는 그릇을 설정
    this.httpRequestsTotal = new Counter({
      name: 'http_requests_total',
      help: '전체 http 요청 수',
      labelNames: ['method', 'route', 'status'] as const,
      registers: [this.registry],
    }); // 전체 요청 수

    this.httpRequestDuration = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'HTTP 요청 지연시간',
      labelNames: ['method', 'route', 'status'] as const, // post, /api, 400 이런 것
      buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2, 5],
      registers: [this.registry],
    }); // 지연 시간

  };

  getRegistry() : Registry {
    return this.registry;
  };
};