import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./App.css";

export default function App() {
  const [algorithm, setAlgorithm] = useState("FCFS");
  const [timeline, setTimeline] = useState([]);
  const [explanation, setExplanation] = useState([]);
  const [stats, setStats] = useState([]);

  const timeQuantum = 2;

  const processes = [
    { pid: "P1", arrival: 0, burst: 5, priority: 2 },
    { pid: "P2", arrival: 1, burst: 3, priority: 1 },
    { pid: "P3", arrival: 2, burst: 8, priority: 3 },
  ];

  function compute() {
    let t = [];
    let exp = [];
    let time = 0;

    let proc = processes.map(p => ({ ...p, remaining: p.burst }));

    exp.push(`Algorithm: ${algorithm}`);

    // ---------- FCFS ----------
    if (algorithm === "FCFS") {
      proc.sort((a, b) => a.arrival - b.arrival);
      proc.forEach(p => {
        let start = time;
        let end = time + p.burst;
        t.push({ pid: p.pid, start, end });
        exp.push(`${p.pid} runs from ${start} to ${end}`);
        time = end;
      });
    }

    // ---------- SJF ----------
    if (algorithm === "SJF") {
      proc.sort((a, b) => a.burst - b.burst);
      proc.forEach(p => {
        let start = time;
        let end = time + p.burst;
        t.push({ pid: p.pid, start, end });
        exp.push(`${p.pid} selected (shortest burst) → ${start} to ${end}`);
        time = end;
      });
    }

    // ---------- PRIORITY ----------
    if (algorithm === "PRIORITY") {
      proc.sort((a, b) => a.priority - b.priority);
      proc.forEach(p => {
        let start = time;
        let end = time + p.burst;
        t.push({ pid: p.pid, start, end });
        exp.push(`${p.pid} selected (highest priority) → ${start} to ${end}`);
        time = end;
      });
    }

    // ---------- ROUND ROBIN ----------
    if (algorithm === "RR") {
      let queue = [...proc];
      while (queue.length > 0) {
        let p = queue.shift();
        let exec = Math.min(timeQuantum, p.remaining);

        let start = time;
        let end = time + exec;

        t.push({ pid: p.pid, start, end });
        exp.push(`${p.pid} runs for ${exec} units → ${start} to ${end}`);

        time = end;
        p.remaining -= exec;

        if (p.remaining > 0) {
          queue.push(p);
        }
      }
    }

    const s = processes.map(p => {
      const last = [...t].reverse().find(x => x.pid === p.pid);
      const first = t.find(x => x.pid === p.pid);
      return {
        name: p.pid,
        Waiting: first.start - p.arrival,
        Turnaround: last.end - p.arrival,
      };
    });

    setTimeline(t);
    setExplanation(exp);
    setStats(s);
  }

  return (
    <div>
      {/* NAVBAR */}
      <nav className="navbar">
        🧠 Intelligent CPU Scheduler
        <div className="nav-links">
          <span>Home</span>
          <span>Simulator</span>
          <span>Algorithms</span>
          <span>About</span>
        </div>
      </nav>

      <div className="container">
        <h2>CPU Scheduling Simulator</h2>

        <div className="grid">
          <div className="card">
            <label>Scheduling Algorithm</label>
            <select
              value={algorithm}
              onChange={e => setAlgorithm(e.target.value)}
            >
              <option value="FCFS">FCFS</option>
              <option value="SJF">SJF</option>
              <option value="PRIORITY">Priority</option>
              <option value="RR">Round Robin</option>
            </select>

            <button className="btn-blue" onClick={compute}>
              Compute
            </button>

            {algorithm === "RR" && (
              <p className="note">Time Quantum = {timeQuantum}</p>
            )}
          </div>

          <div className="card">
            <h3>Gantt Chart</h3>
            <div className="gantt">
              {timeline.map((t, i) => (
                <div key={i} className="gantt-box">
                  <b>{t.pid}</b>
                  <div>{t.start} - {t.end}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {explanation.length > 0 && (
          <div className="card mt">
            <h3>🧠 Explanation</h3>
            <ul>
              {explanation.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
        )}

        {stats.length > 0 && (
          <div className="card mt">
            <h3>📊 Performance</h3>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={stats}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="Waiting" fill="#2563eb" />
                  <Bar dataKey="Turnaround" fill="#16a34a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
