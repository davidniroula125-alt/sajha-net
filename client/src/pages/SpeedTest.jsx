import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiWifi, FiDownload, FiClock, FiActivity, FiRefreshCw, FiCheck, FiFileText, FiArrowDown } from 'react-icons/fi';
import { Section } from '../components/common/UIComponents';

const TEST_SIZES = [5, 10, 25];
const GAUGE_MAX = 500;

function Gauge({ speed, maxSpeed, status }) {
  const pct = Math.min(speed / maxSpeed, 1);
  const angle = -135 + pct * 270;
  const radius = 100;
  const cx = 120;
  const cy = 120;

  const arcPath = (startDeg, endDeg) => {
    const toRad = (d) => (d * Math.PI) / 180;
    const x1 = cx + radius * Math.cos(toRad(startDeg));
    const y1 = cy + radius * Math.sin(toRad(startDeg));
    const x2 = cx + radius * Math.cos(toRad(endDeg));
    const y2 = cy + radius * Math.sin(toRad(endDeg));
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2}`;
  };

  const needleX = cx + (radius - 10) * Math.cos((angle * Math.PI) / 180);
  const needleY = cy + (radius - 10) * Math.sin((angle * Math.PI) / 180);

  const getColor = () => {
    if (status === 'error') return '#ef4444';
    if (pct < 0.3) return '#ef4444';
    if (pct < 0.6) return '#f59e0b';
    if (pct < 0.8) return '#3b82f6';
    return '#22c55e';
  };

  const getLabel = () => {
    if (status === 'error') return 'Error';
    if (pct < 0.3) return 'Slow';
    if (pct < 0.6) return 'Good';
    if (pct < 0.8) return 'Fast';
    return 'Excellent';
  };

  return (
    <div className="relative inline-block">
      <svg width="240" height="160" viewBox="0 0 240 160">
        <path d={arcPath(135, 135 + 270)} fill="none" stroke="#1e293b" strokeWidth="12" strokeLinecap="round" />
        <path
          d={arcPath(135, 135 + pct * 270)}
          fill="none"
          stroke={getColor()}
          strokeWidth="12"
          strokeLinecap="round"
          style={{ transition: 'all 0.3s ease-out' }}
        />
        <line
          x1={cx}
          y1={cy}
          x2={needleX}
          y2={needleY}
          stroke={getColor()}
          strokeWidth="3"
          strokeLinecap="round"
          style={{ transition: 'all 0.3s ease-out' }}
        />
        <circle cx={cx} cy={cy} r="6" fill={getColor()} style={{ transition: 'fill 0.3s' }} />
        {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
          const a = ((-135 + p * 270) * Math.PI) / 180;
          const tx = cx + (radius + 16) * Math.cos(a);
          const ty = cy + (radius + 16) * Math.sin(a);
          return (
            <text key={i} x={tx} y={ty} textAnchor="middle" dominantBaseline="middle" className="fill-gray-500 dark:fill-gray-400" style={{ fontSize: '10px' }}>
              {Math.round(p * GAUGE_MAX)}
            </text>
          );
        })}
      </svg>
      <div className="text-center mt-2">
        <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: getColor() + '20', color: getColor() }}>
          {getLabel()}
        </span>
      </div>
    </div>
  );
}

export default function SpeedTest() {
  const [status, setStatus] = useState('idle');
  const [speed, setSpeed] = useState(0);
  const [ping, setPing] = useState(0);
  const [pingResults, setPingResults] = useState([]);
  const [downloadSize, setDownloadSize] = useState(0);
  const [downloadTime, setDownloadTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [testSize, setTestSize] = useState(10);
  const [activeTab, setActiveTab] = useState('download');
  const abortRef = useRef(null);
  const gaugeMax = testSize <= 5 ? 100 : testSize <= 10 ? 200 : GAUGE_MAX;

  const runPing = useCallback(async (onPing) => {
    const results = [];
    for (let i = 0; i < 10; i++) {
      const start = performance.now();
      try {
        await fetch('/api/health', { cache: 'no-store' });
        const ms = Math.round(performance.now() - start);
        results.push(ms);
        if (onPing) onPing(ms, i + 1);
      } catch {
        results.push(0);
      }
    }
    const valid = results.filter((r) => r > 0);
    return { avg: valid.length > 0 ? Math.round(valid.reduce((a, b) => a + b, 0) / valid.length) : 0, results };
  }, []);

  const runDownload = useCallback(async (signal) => {
    const start = performance.now();
    const res = await fetch(`/api/speed-test?size=${testSize}`, { cache: 'no-store', signal });
    const reader = res.body.getReader();
    let received = 0;
    const contentLength = parseInt(res.headers.get('Content-Length') || testSize * 1024 * 1024);

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      received += value.length;
      setProgress(Math.round((received / contentLength) * 100));
    }

    const elapsed = (performance.now() - start) / 1000;
    const bitsPerSecond = (received * 8) / elapsed;
    return { speed: Math.round(bitsPerSecond / 1000000), size: received, time: elapsed };
  }, [testSize]);

  const startTest = useCallback(async () => {
    setStatus('ping');
    setSpeed(0);
    setPing(0);
    setPingResults([]);
    setProgress(0);
    setDownloadSize(0);
    setDownloadTime(0);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const { avg, results } = await runPing((ms) => {
        setPingResults(prev => [...prev, ms]);
        setPing(ms);
      });
      setPing(avg);
      setPingResults(results);

      setStatus('download');
      const result = await runDownload(controller.signal);
      setSpeed(result.speed);
      setDownloadSize(result.size);
      setDownloadTime(result.time.toFixed(2));
      setStatus('done');
    } catch (err) {
      if (err.name !== 'AbortError') {
        setStatus('error');
        setSpeed(0);
      }
    }
  }, [runPing, runDownload]);

  const resetTest = useCallback(() => {
    if (abortRef.current) abortRef.current.abort();
    setStatus('idle');
    setSpeed(0);
    setPing(0);
    setPingResults([]);
    setProgress(0);
    setDownloadSize(0);
    setDownloadTime(0);
  }, []);

  const handleTestAgain = useCallback(() => {
    resetTest();
    setTimeout(() => startTest(), 100);
  }, [resetTest, startTest]);

  const startDownloadTest = useCallback(async () => {
    if (status === 'ping' || status === 'download') return;
    resetTest();
    setStatus('download');
    setSpeed(0);
    setProgress(0);
    setDownloadSize(0);
    setDownloadTime(0);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const result = await runDownload(controller.signal);
      setSpeed(result.speed);
      setDownloadSize(result.size);
      setDownloadTime(result.time.toFixed(2));
      setStatus('done');
    } catch (err) {
      if (err.name !== 'AbortError') {
        setStatus('error');
        setSpeed(0);
      }
    }
  }, [status, resetTest, runDownload]);

  const runPingTests = useCallback(async () => {
    if (status === 'ping' || status === 'download') return;
    resetTest();
    setStatus('ping');
    setPing(0);
    setPingResults([]);

    try {
      const { avg, results } = await runPing((ms) => {
        setPingResults(prev => [...prev, ms]);
        setPing(ms);
      });
      setPing(avg);
      setPingResults(results);
      setStatus('idle');
    } catch {
      setStatus('error');
    }
  }, [status, resetTest, runPing]);

  const formatBytes = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const downloadResults = useCallback(() => {
    const validPings = pingResults.filter(function(r) { return r > 0; });
    const minP = validPings.length > 0 ? Math.min.apply(null, validPings) : 0;
    const maxP = validPings.length > 0 ? Math.max.apply(null, validPings) : 0;
    const rating = speed >= 100 ? 'Excellent' : speed >= 50 ? 'Good' : speed >= 20 ? 'Fair' : 'Slow';

    let barsHtml = '';
    if (validPings.length > 0) {
      const barMax = Math.max.apply(null, validPings);
      validPings.forEach(function(r, i) {
        const bh = Math.max((r / barMax) * 40, 4);
        const color = r < 30 ? '#22c55e' : r < 80 ? '#f59e0b' : '#ef4444';
        const x = 50 + i * 52;
        barsHtml += '<rect x="' + x + '" y="' + (360 + (40 - bh)) + '" width="40" height="' + bh + '" fill="' + color + '"/>';
        barsHtml += '<text x="' + (x + 20) + '" y="420" text-anchor="middle" fill="#e2e8f0" font-size="9">' + r + 'ms</text>';
      });
    }

    const svg = [
      '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="490">',
      '<rect width="600" height="490" fill="#0f172a"/>',
      '<text x="300" y="30" text-anchor="middle" fill="#22d3ee" font-family="Arial" font-weight="bold" font-size="13">SAJHA NET</text>',
      '<text x="300" y="56" text-anchor="middle" fill="#ffffff" font-family="Arial" font-weight="bold" font-size="24">Speed Test Results</text>',
      '<text x="300" y="76" text-anchor="middle" fill="#94a3b8" font-family="Arial" font-size="12">' + new Date().toLocaleString() + '</text>',
      '<line x1="30" y1="90" x2="570" y2="90" stroke="#334155" stroke-width="1"/>',
      '<text x="50" y="120" fill="#22d3ee" font-family="Arial" font-weight="bold" font-size="15">DOWNLOAD SPEED</text>',
      '<text x="50" y="175" fill="#ffffff" font-family="Arial" font-weight="bold" font-size="48">' + speed + '</text>',
      '<text x="130" y="175" fill="#94a3b8" font-family="Arial" font-size="18">Mbps</text>',
      '<text x="50" y="200" fill="#94a3b8" font-family="Arial" font-size="12">Downloaded: ' + formatBytes(downloadSize) + '  |  Time: ' + downloadTime + 's  |  Size: ' + testSize + ' MB</text>',
      '<line x1="30" y1="218" x2="570" y2="218" stroke="#334155" stroke-width="1"/>',
      '<text x="50" y="248" fill="#22d3ee" font-family="Arial" font-weight="bold" font-size="15">LATENCY (PING)</text>',
      '<rect x="50" y="262" width="160" height="55" rx="6" fill="#1e293b" stroke="#475569"/>',
      '<text x="130" y="282" text-anchor="middle" fill="#94a3b8" font-family="Arial" font-size="11">Average</text>',
      '<text x="130" y="307" text-anchor="middle" fill="#ffffff" font-family="Arial" font-weight="bold" font-size="20">' + ping + ' ms</text>',
      '<rect x="220" y="262" width="160" height="55" rx="6" fill="#1e293b" stroke="#475569"/>',
      '<text x="300" y="282" text-anchor="middle" fill="#94a3b8" font-family="Arial" font-size="11">Minimum</text>',
      '<text x="300" y="307" text-anchor="middle" fill="#22c55e" font-family="Arial" font-weight="bold" font-size="20">' + minP + ' ms</text>',
      '<rect x="390" y="262" width="160" height="55" rx="6" fill="#1e293b" stroke="#475569"/>',
      '<text x="470" y="282" text-anchor="middle" fill="#94a3b8" font-family="Arial" font-size="11">Maximum</text>',
      '<text x="470" y="307" text-anchor="middle" fill="#ef4444" font-family="Arial" font-weight="bold" font-size="20">' + maxP + ' ms</text>',
      '<text x="50" y="350" fill="#94a3b8" font-family="Arial" font-size="11">Ping History:</text>',
      barsHtml,
      '<rect x="30" y="440" width="540" height="40" rx="6" fill="#1e293b" stroke="#475569"/>',
      '<text x="300" y="465" text-anchor="middle" fill="#22d3ee" font-family="Arial" font-weight="bold" font-size="13">www.sajhanet.com  |  ' + speed + ' Mbps  |  ' + ping + 'ms ping  |  ' + rating + '</text>',
      '</svg>'
    ].join('\n');

    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = function() {
      const c = document.createElement('canvas');
      c.width = 600;
      c.height = 490;
      const cx = c.getContext('2d');
      cx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      const link = document.createElement('a');
      link.download = 'sajha-net-speed-test-' + Date.now() + '.png';
      link.href = c.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    img.src = url;
  }, [speed, ping, pingResults, downloadSize, downloadTime, testSize, formatBytes]);

  var minPing = pingResults.length > 0 ? Math.min.apply(null, pingResults.filter(function(r) { return r > 0; })) : 0;
  var maxPing = pingResults.length > 0 ? Math.max.apply(null, pingResults.filter(function(r) { return r > 0; })) : 0;

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <section className="relative text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&q=80)' }} />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/85 via-primary-900/80 to-secondary-900/85" />
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Speed <span className="text-primary-400">Test</span></h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">Test your internet connection speed with Sajha Net. Works on Windows, Mac, and all modern browsers.</p>
          </motion.div>
        </div>
      </section>

      <Section>
        <div className="max-w-2xl mx-auto">
          <div className="card p-8 text-center">
            {status === 'idle' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <FiWifi className="w-16 h-16 text-primary-500 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Ready to Test</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8">Click the button below to measure your download speed.</p>

                <div className="flex justify-center gap-3 mb-8">
                  {TEST_SIZES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setTestSize(s)}
                      className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
                        testSize === s ? 'gradient-bg text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {s} MB
                    </button>
                  ))}
                </div>

                <button onClick={startTest} className="px-10 py-4 gradient-bg text-white rounded-2xl font-bold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  Start Speed Test
                </button>
              </motion.div>
            )}

            {(status === 'ping' || status === 'download') && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Gauge speed={status === 'download' ? speed : 0} maxSpeed={gaugeMax} status={status} />
                <div className="mt-4">
                  <p className="text-5xl font-bold gradient-text mb-2">{status === 'download' ? speed : 0} <span className="text-lg text-gray-500 dark:text-gray-400">Mbps</span></p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {status === 'ping' ? 'Measuring latency...' : 'Downloading test data...'}
                  </p>
                </div>
                <div className="mt-6 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <motion.div
                    className="h-3 rounded-full gradient-bg"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{progress}% complete</p>
              </motion.div>
            )}

            {status === 'done' && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                <Gauge speed={speed} maxSpeed={gaugeMax} status={status} />
                <div className="mt-4 mb-6">
                  <p className="text-6xl font-bold gradient-text mb-2">{speed} <span className="text-lg text-gray-500 dark:text-gray-400">Mbps</span></p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Download Speed</p>
                </div>

                <div className="flex justify-center mb-6">
                  <div className="inline-flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                    <button onClick={() => setActiveTab('download')} className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'download' ? 'gradient-bg text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                      <FiDownload className="w-4 h-4 inline mr-1" /> Download
                    </button>
                    <button onClick={() => setActiveTab('latency')} className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'latency' ? 'gradient-bg text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                      <FiClock className="w-4 h-4 inline mr-1" /> Latency
                    </button>
                  </div>
                </div>

                {activeTab === 'download' && (
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                      <FiArrowDown className="w-5 h-5 text-primary-500 mx-auto mb-2" />
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{speed}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Mbps</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                      <FiDownload className="w-5 h-5 text-primary-500 mx-auto mb-2" />
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{formatBytes(downloadSize)}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Downloaded</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                      <FiActivity className="w-5 h-5 text-primary-500 mx-auto mb-2" />
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{downloadTime}s</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Time</p>
                    </div>
                  </div>
                )}

                {activeTab === 'latency' && (
                  <div className="mb-8">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                        <FiClock className="w-5 h-5 text-primary-500 mx-auto mb-2" />
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{ping}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Avg (ms)</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                        <FiClock className="w-5 h-5 text-green-500 mx-auto mb-2" />
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{minPing}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Min (ms)</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                        <FiClock className="w-5 h-5 text-red-500 mx-auto mb-2" />
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{maxPing}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Max (ms)</p>
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                      <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2">Ping History (10 tests)</p>
                      <div className="flex flex-wrap gap-2">
                        {pingResults.map((r, i) => (
                          <span key={i} className={`px-2 py-1 rounded text-xs font-medium ${r < 30 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : r < 80 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'}`}>
                            {r} ms
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-center gap-4">
                  <button onClick={handleTestAgain} className="flex items-center gap-2 px-8 py-3 gradient-bg text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                    <FiRefreshCw className="w-4 h-4" /> Test Again
                  </button>
                  <button onClick={downloadResults} className="flex items-center gap-2 px-8 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
                    <FiFileText className="w-4 h-4" /> Download Results
                  </button>
                </div>
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <FiWifi className="w-16 h-16 text-red-500 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Test Failed</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8">Could not connect to the speed test server. Please check your connection and try again.</p>
                <button onClick={handleTestAgain} className="flex items-center gap-2 mx-auto px-8 py-3 gradient-bg text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                  <FiRefreshCw className="w-4 h-4" /> Try Again
                </button>
              </motion.div>
            )}
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4">
            <button onClick={startDownloadTest} className="card p-4 text-center hover:scale-105 hover:border-primary-500 border border-transparent transition-all cursor-pointer">
              <FiDownload className="w-6 h-6 text-primary-500 mx-auto mb-2" />
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">Download Test</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Measures how fast data is downloaded from our server</p>
            </button>
            <button onClick={runPingTests} className="card p-4 text-center hover:scale-105 hover:border-primary-500 border border-transparent transition-all cursor-pointer">
              <FiClock className="w-6 h-6 text-primary-500 mx-auto mb-2" />
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">Latency (Ping)</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Measures the response time of your connection</p>
            </button>
            <div className="card p-4 text-center">
              <FiCheck className="w-6 h-6 text-primary-500 mx-auto mb-2" />
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">Works Everywhere</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">No downloads needed. Works in any modern browser</p>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
