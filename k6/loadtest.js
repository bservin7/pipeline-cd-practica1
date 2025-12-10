import http from 'k6/http';
import { check } from 'k6';
import { Trend } from 'k6/metrics';

export let options = {
  vus: 20,
  duration: '30s',
  thresholds: {
    'http_req_duration{type:health}': ['p(95)<500'], // p95 < 500ms
    'http_req_failed': ['rate<0.05'] // <5% errors
  }
};

const t = new Trend('p95_latency');

export default function () {
  let r = http.get(__ENV.BASE_URL + '/health', { tags: { type: 'health' }});
  check(r, { 'status 200': (r) => r.status === 200 });
  let r2 = http.get(__ENV.BASE_URL + '/feature');
  check(r2, { 'status 200': (r) => r.status === 200 });
}
