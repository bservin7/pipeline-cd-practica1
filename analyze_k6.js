const fs = require('fs');

if (process.argv.length < 3) {
  console.error('Usage: node analyze_k6.js <k6-summary.json>');
  process.exit(2);
}
const p = process.argv[2];
const content = JSON.parse(fs.readFileSync(p));
const metrics = content.metrics;
const httpReqDuration = metrics['http_req_duration'];
const p95 = (httpReqDuration && httpReqDuration['p(95)']) ? httpReqDuration['p(95)'] : null;
const failures = (metrics['http_req_failed'] && metrics['http_req_failed'].values && metrics['http_req_failed'].values.rate) ? metrics['http_req_failed'].values.rate : null;

console.log('p95:', p95);
console.log('error_rate:', failures);

if (p95 === null || failures === null) {
  process.exit(3);
}

// thresholds: p95 < 500 ms, error_rate < 0.05
if (p95 < 500 && failures < 0.05) {
  console.log('STATUS: PASS');
  process.exit(0);
} else {
  console.log('STATUS: FAIL');
  process.exit(4);
}
