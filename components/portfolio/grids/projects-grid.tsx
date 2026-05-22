'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GridBottomSheet } from '../grid-bottom-sheet'

interface ProjectStructureNode {
  name: string
  type: 'folder' | 'file'
  children?: ProjectStructureNode[]
}

interface SideProject {
  id: string
  name: string
  description: string
  url: string
  /** filename under /gif/ — e.g. "project-1" → /gif/project-1.png */
  iconFile: string
  tags: string[]
  longDescription: string
  status: 'live' | 'wip' | 'archived'
  structure: ProjectStructureNode[]
}

/* ─ Project data ─ */

const sideProjects: SideProject[] = [
  {
    id: '1',
    name: 'MLFlow Dashboard',
    description: 'Open-source ML experiment tracking and visualization tool.',
    url: 'mlflow-dash.dev',
    iconFile: 'project-1',
    tags: ['Python', 'React', 'FastAPI'],
    status: 'live',
    longDescription:
      'A modern, self-hosted experiment tracking UI for MLflow that replaces the default interface with a more performant and feature-rich dashboard. Supports metric comparison across hundreds of runs with real-time streaming.',
    structure: [
      {
        name: 'mlflow-dashboard', type: 'folder', children: [
          { name: 'backend', type: 'folder', children: [
            { name: 'api', type: 'folder', children: [
              { name: 'routes.py', type: 'file' },
              { name: 'schemas.py', type: 'file' },
            ]},
            { name: 'mlflow_client.py', type: 'file' },
            { name: 'main.py', type: 'file' },
          ]},
          { name: 'frontend', type: 'folder', children: [
            { name: 'components', type: 'folder', children: [
              { name: 'RunTable.tsx', type: 'file' },
              { name: 'MetricChart.tsx', type: 'file' },
            ]},
            { name: 'pages', type: 'folder', children: [
              { name: 'index.tsx', type: 'file' },
              { name: 'experiment.tsx', type: 'file' },
            ]},
          ]},
          { name: 'docker-compose.yml', type: 'file' },
          { name: 'README.md', type: 'file' },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'DataViz Pro',
    description: 'Interactive data visualization library for Python and JavaScript.',
    url: 'datavizpro.io',
    iconFile: 'project-2',
    tags: ['D3.js', 'Python', 'WebGL'],
    status: 'live',
    longDescription:
      'A high-performance charting library that bridges Python data science workflows with interactive browser-based visualizations. Handles datasets with millions of points using WebGL rendering.',
    structure: [
      {
        name: 'dataviz-pro', type: 'folder', children: [
          { name: 'src', type: 'folder', children: [
            { name: 'renderers', type: 'folder', children: [
              { name: 'WebGLRenderer.ts', type: 'file' },
              { name: 'SVGFallback.ts', type: 'file' },
            ]},
            { name: 'charts', type: 'folder', children: [
              { name: 'LineChart.ts', type: 'file' },
              { name: 'ScatterPlot.ts', type: 'file' },
              { name: 'Heatmap.ts', type: 'file' },
            ]},
            { name: 'index.ts', type: 'file' },
          ]},
          { name: 'python', type: 'folder', children: [
            { name: 'datavizpro', type: 'folder', children: [
              { name: 'plot.py', type: 'file' },
              { name: 'bridge.py', type: 'file' },
            ]},
          ]},
          { name: 'package.json', type: 'file' },
          { name: 'pyproject.toml', type: 'file' },
        ],
      },
    ],
  },
  {
    id: '3',
    name: 'NeuralKit',
    description: 'A simplified deep learning framework built for rapid prototyping.',
    url: 'neuralkit.dev',
    iconFile: 'project-3',
    tags: ['Python', 'NumPy', 'CUDA'],
    status: 'wip',
    longDescription:
      'A from-scratch deep learning framework designed for learners and researchers who want to understand what happens under the hood. Implements autograd, optimizers, and common layer types without hiding complexity.',
    structure: [
      {
        name: 'neuralkit', type: 'folder', children: [
          { name: 'neuralkit', type: 'folder', children: [
            { name: 'core', type: 'folder', children: [
              { name: 'tensor.py', type: 'file' },
              { name: 'autograd.py', type: 'file' },
              { name: 'graph.py', type: 'file' },
            ]},
            { name: 'layers', type: 'folder', children: [
              { name: 'linear.py', type: 'file' },
              { name: 'conv2d.py', type: 'file' },
              { name: 'activations.py', type: 'file' },
            ]},
            { name: 'optim', type: 'folder', children: [
              { name: 'sgd.py', type: 'file' },
              { name: 'adam.py', type: 'file' },
            ]},
            { name: 'cuda', type: 'folder', children: [
              { name: 'kernels.cu', type: 'file' },
              { name: 'bindings.py', type: 'file' },
            ]},
          ]},
          { name: 'examples', type: 'folder', children: [
            { name: 'mnist.py', type: 'file' },
            { name: 'transformer.py', type: 'file' },
          ]},
          { name: 'setup.py', type: 'file' },
        ],
      },
    ],
  },
  {
    id: '4',
    name: 'AutoML Studio',
    description: 'No-code machine learning platform for non-technical users.',
    url: 'automl.studio',
    iconFile: 'project-4',
    tags: ['Next.js', 'sklearn', 'TypeScript'],
    status: 'live',
    longDescription:
      'Drag-and-drop interface for building, training, and deploying ML models without writing code. Supports tabular data, image classification, and NLP tasks with auto feature engineering.',
    structure: [
      {
        name: 'automl-studio', type: 'folder', children: [
          { name: 'app', type: 'folder', children: [
            { name: '(dashboard)', type: 'folder', children: [
              { name: 'page.tsx', type: 'file' },
              { name: 'layout.tsx', type: 'file' },
            ]},
            { name: 'api', type: 'folder', children: [
              { name: 'train', type: 'folder', children: [{ name: 'route.ts', type: 'file' }]},
              { name: 'predict', type: 'folder', children: [{ name: 'route.ts', type: 'file' }]},
            ]},
          ]},
          { name: 'ml-engine', type: 'folder', children: [
            { name: 'pipeline.py', type: 'file' },
            { name: 'feature_eng.py', type: 'file' },
            { name: 'model_zoo.py', type: 'file' },
          ]},
          { name: 'next.config.js', type: 'file' },
          { name: 'requirements.txt', type: 'file' },
        ],
      },
    ],
  },
  {
    id: '5',
    name: 'GPU Monitor',
    description: 'Real-time GPU utilization monitoring dashboard for ML workloads.',
    url: 'gpu-monitor.io',
    iconFile: 'project-5',
    tags: ['Go', 'React', 'WebSockets'],
    status: 'live',
    longDescription:
      'Lightweight daemon + web dashboard that tracks GPU memory, utilization, temperature, and power draw across multiple nodes. Supports NVIDIA and AMD GPUs with alerting via Slack/email.',
    structure: [
      {
        name: 'gpu-monitor', type: 'folder', children: [
          { name: 'daemon', type: 'folder', children: [
            { name: 'collector', type: 'folder', children: [
              { name: 'nvidia.go', type: 'file' },
              { name: 'amd.go', type: 'file' },
            ]},
            { name: 'ws_server.go', type: 'file' },
            { name: 'alerting.go', type: 'file' },
            { name: 'main.go', type: 'file' },
          ]},
          { name: 'web', type: 'folder', children: [
            { name: 'src', type: 'folder', children: [
              { name: 'components', type: 'folder', children: [
                { name: 'GPUCard.tsx', type: 'file' },
                { name: 'LiveChart.tsx', type: 'file' },
              ]},
              { name: 'hooks', type: 'folder', children: [
                { name: 'useWebSocket.ts', type: 'file' },
              ]},
            ]},
          ]},
          { name: 'go.mod', type: 'file' },
          { name: 'Dockerfile', type: 'file' },
        ],
      },
    ],
  },
  {
    id: '6',
    name: 'Model Hub',
    description: 'Repository of pre-trained models and fine-tuning recipes.',
    url: 'modelhub.ai',
    iconFile: 'project-6',
    tags: ['Python', 'Docker', 'S3'],
    status: 'wip',
    longDescription:
      'A curated registry of production-ready pre-trained models with tested fine-tuning recipes for common tasks. Each model ships with evaluation benchmarks, memory requirements, and deployment configs.',
    structure: [
      {
        name: 'model-hub', type: 'folder', children: [
          { name: 'registry', type: 'folder', children: [
            { name: 'api', type: 'folder', children: [
              { name: 'models.py', type: 'file' },
              { name: 'recipes.py', type: 'file' },
              { name: 'search.py', type: 'file' },
            ]},
            { name: 'storage', type: 'folder', children: [
              { name: 's3_backend.py', type: 'file' },
              { name: 'versioning.py', type: 'file' },
            ]},
          ]},
          { name: 'recipes', type: 'folder', children: [
            { name: 'classification', type: 'folder', children: [
              { name: 'finetune.py', type: 'file' },
              { name: 'eval.py', type: 'file' },
            ]},
            { name: 'nlp', type: 'folder', children: [
              { name: 'finetune.py', type: 'file' },
            ]},
          ]},
          { name: 'docker', type: 'folder', children: [
            { name: 'Dockerfile.registry', type: 'file' },
            { name: 'Dockerfile.worker', type: 'file' },
          ]},
          { name: 'docker-compose.yml', type: 'file' },
        ],
      },
    ],
  },
]

/* ─ Status config ─ */

const statusConfig = {
  live:     { label: 'Live',     color: '#00cc88', bg: '#00cc8818' },
  wip:      { label: 'WIP',      color: '#f7b731', bg: '#f7b73118' },
  archived: { label: 'Archived', color: '#888888', bg: '#88888818' },
}

/* ─ Accent colour per project ─ */

const accentColors: Record<string, string> = {
  '1': '#00cc88',
  '2': '#ff6b6b',
  '3': '#4ecdc4',
  '4': '#f7b731',
  '5': '#a55eea',
  '6': '#26de81',
}

/* ─────────────────────────────────────────────────────────────────────────────
   ProjectIcon
   Plain <img> — no wrapper, no border, no background container.
   Falls back to a tiny SVG initial if the image fails to load.
   Size is passed in so the same component works at list size (40px)
   and at the enlarged detail size in the sheet (~52px).
   ───────────────────────────────────────────────────────────────────────────── */

interface ProjectIconProps {
  project: SideProject
  size?: number
}

function ProjectIcon({ project, size = 40 }: ProjectIconProps) {
  const [errored, setErrored] = useState(false)
  const accent = accentColors[project.id]

  if (errored) {
    // Minimal text fallback — no box, just a letter in the accent colour
    return (
      <span
        style={{
          width:          size,
          height:         size,
          display:       'flex',
          alignItems:    'center',
          justifyContent:'center',
          fontSize:       size * 0.45,
          fontWeight:     700,
          color:          accent,
          flexShrink:     0,
          userSelect:    'none',
        }}
      >
        {project.name.charAt(0)}
      </span>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/gif/${project.iconFile}.png`}
      alt={project.name}
      width={size}
      height={size}
      onError={() => setErrored(true)}
      style={{
        width:      size,
        height:     size,
        objectFit: 'contain',
        flexShrink: 0,
        display:   'block',
        /* No border-radius, no shadow, no background — just the raw image */
      }}
    />
  )
}

/* ─ File tree ─ */

interface TreeNodeProps {
  node: ProjectStructureNode
  depth?: number
  accentColor: string
  isLast?: boolean
  parentLines?: boolean[]
}

function TreeGuide({ show }: { show: boolean }) {
  return (
    <div
      className="flex-shrink-0 self-stretch"
      style={{
        width:      16,
        borderLeft: show ? '1px solid rgba(128,128,128,0.18)' : '1px solid transparent',
      }}
    />
  )
}

function TreeConnector({ isLast }: { isLast: boolean }) {
  return (
    <div className="flex-shrink-0 relative" style={{ width: 16, alignSelf: 'stretch' }}>
      <div style={{
        position:   'absolute',
        left:        0,
        top:         0,
        bottom:      isLast ? '50%' : 0,
        width:       1,
        background: 'rgba(128,128,128,0.18)',
      }} />
      <div style={{
        position:   'absolute',
        left:        0,
        top:        '50%',
        width:       10,
        height:      1,
        background: 'rgba(128,128,128,0.18)',
        transform:  'translateY(-0.5px)',
      }} />
    </div>
  )
}

function TreeNode({ node, depth = 0, accentColor, isLast = false, parentLines = [] }: TreeNodeProps) {
  const [open, setOpen] = useState(depth < 2)

  const guides    = parentLines.map((show, i) => <TreeGuide key={i} show={show} />)
  const connector = depth > 0 ? <TreeConnector isLast={isLast} /> : null
  const rowPrefix = <>{guides}{connector}</>

  if (node.type === 'folder') {
    const childLines = [...parentLines, !isLast]
    return (
      <div>
        <button
          onClick={() => setOpen(o => !o)}
          className="flex items-center w-full text-left"
          style={{ height: 26 }}
        >
          {rowPrefix}
          <svg
            width="10" height="10" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5"
            className="flex-shrink-0 mr-1"
            style={{
              color:     accentColor,
              opacity:   0.7,
              transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
              transition:'transform 0.15s',
            }}
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
          <svg
            width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2"
            className="flex-shrink-0 mr-1.5"
            style={{ color: accentColor, opacity: 0.65 }}
          >
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
          <span className="text-[11.5px] font-medium truncate" style={{ color: 'var(--text-primary)', opacity: 0.9 }}>
            {node.name}
          </span>
        </button>
        {open && node.children && (
          <div>
            {node.children.map((child, i) => (
              <TreeNode
                key={child.name}
                node={child}
                depth={depth + 1}
                accentColor={accentColor}
                isLast={i === node.children!.length - 1}
                parentLines={childLines}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex items-center" style={{ height: 24 }}>
      {rowPrefix}
      <div className="flex-shrink-0" style={{ width: 12 }} />
      <svg
        width="12" height="12" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2"
        className="flex-shrink-0 mr-1.5"
        style={{ color: 'var(--text-muted)', opacity: 0.6 }}
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
      <span className="text-[11px] truncate font-mono" style={{ color: 'var(--text-secondary)', opacity: 0.75 }}>
        {node.name}
      </span>
    </div>
  )
}

/* ─ Main component ─ */

interface ProjectsGridProps { isMobile?: boolean }

export function ProjectsGrid({ isMobile }: ProjectsGridProps) {
  const [selected, setSelected]   = useState<SideProject | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const cls = isMobile
    ? 'w-full rounded-2xl border overflow-hidden flex flex-col'
    : 'grid-card-desktop flex-shrink-0 w-[480px] h-[calc(100vh-88px)] rounded-2xl border overflow-hidden flex flex-col'

  const currentIndex = selected ? sideProjects.findIndex(p => p.id === selected.id) : -1

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.19 }}
      className={cls}
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
    >
      {/* Header */}
      <div
        className="px-5 pt-5 pb-4 border-b flex-shrink-0"
        style={{ borderColor: 'var(--border)' }}
      >
        <span className="grid-label">Side Projects</span>
      </div>

      {/* Panel container */}
      <div className="flex-1 relative" style={{ overflow: 'clip' }}>

        {/* ── Project list ── */}
        <div
          className="absolute inset-0 no-scrollbar p-4"
          data-grid-scroll
          style={{ overflowY: 'auto', overscrollBehavior: 'contain' }}
        >
          <div className="space-y-1">
            {sideProjects.map((project, i) => {
              const isHovered = hoveredId === project.id
              const accent    = accentColors[project.id]
              return (
                <motion.button
                  key={project.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.28, delay: i * 0.05 }}
                  onClick={() => setSelected(project)}
                  onMouseEnter={() => setHoveredId(project.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="w-full text-left"
                >
                  <div
                    className="flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-150"
                    style={{
                      background: isHovered ? `${accent}0d` : 'transparent',
                      transform:  isHovered ? 'translateX(2px)' : 'translateX(0)',
                    }}
                  >
                    {/* Icon — bare image, no container */}
                    <ProjectIcon project={project} size={40} />

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3
                          className="text-[13px] font-medium truncate flex-1 min-w-0 transition-colors duration-150"
                          style={{ color: isHovered ? accent : 'var(--text-primary)' }}
                        >
                          {project.name}
                        </h3>
                        <span
                          className="px-1.5 py-0.5 rounded text-[9px] font-semibold flex-shrink-0 uppercase tracking-wide"
                          style={{ background: statusConfig[project.status].bg, color: statusConfig[project.status].color }}
                        >
                          {statusConfig[project.status].label}
                        </span>
                      </div>
                      <p className="text-[12px] leading-snug truncate" style={{ color: 'var(--text-secondary)' }}>
                        {project.description}
                      </p>
                      <p className="text-[10px] font-mono mt-0.5 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                        {project.url}
                      </p>
                    </div>

                    <svg
                      width="12" height="12" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2"
                      className="flex-shrink-0 transition-all duration-150"
                      style={{
                        color:     isHovered ? accent : 'var(--text-muted)',
                        transform: isHovered ? 'translateX(2px)' : 'translateX(0)',
                      }}
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* ── Bottom sheet detail overlay ── */}
        <GridBottomSheet
          open={!!selected}
          onClose={() => setSelected(null)}
          accentColor={selected ? accentColors[selected.id] : 'var(--accent)'}
        >
          {selected && (
            <>
              {/* Scrollable content */}
              <div
                className="flex-1 no-scrollbar px-5 pb-4"
                data-grid-scroll
                style={{ overflowY: 'auto', overscrollBehavior: 'contain' }}
              >
                {/* Icon + status */}
                <div className="flex items-start justify-between mb-5 pt-1">
                  {/* Enlarged project icon — bare image, no box */}
                  <ProjectIcon project={selected} size={52} />
                  <span
                    className="px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide"
                    style={{
                      background: statusConfig[selected.status].bg,
                      color:      statusConfig[selected.status].color,
                    }}
                  >
                    {statusConfig[selected.status].label}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-[21px] font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                  {selected.name}
                </h2>

                {/* URL */}
                <a
                  href={`https://${selected.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-mono mb-4 inline-flex items-center gap-1.5 hover:opacity-70 transition-opacity"
                  style={{ color: accentColors[selected.id] }}
                >
                  {selected.url}
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </a>

                {/* Description */}
                <p className="text-[13px] leading-relaxed mt-4 mb-7" style={{ color: 'var(--text-secondary)' }}>
                  {selected.longDescription}
                </p>

                {/* Stack */}
                <div className="border-t pt-5 mb-6" style={{ borderColor: 'var(--sheet-row-border)' }}>
                  <span className="grid-label block mb-3">Stack</span>
                  <div className="flex flex-wrap gap-2">
                    {selected.tags.map(t => (
                      <span
                        key={t}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-medium"
                        style={{ background: `${accentColors[selected.id]}18`, color: accentColors[selected.id] }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Project structure */}
                <div className="border-t pt-5" style={{ borderColor: 'var(--sheet-row-border)' }}>
                  <span className="grid-label block mb-3">Project Structure</span>
                  <div
                    className="rounded-xl p-3.5"
                    style={{
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--sheet-row-border)',
                    }}
                  >
                    {selected.structure.map((node, i) => (
                      <TreeNode
                        key={node.name}
                        node={node}
                        depth={0}
                        accentColor={accentColors[selected.id]}
                        isLast={i === selected.structure.length - 1}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Nav bar */}
              <div
                className="flex-shrink-0 px-5 py-4 flex items-center justify-center"
                style={{ borderTop: '1px solid var(--sheet-row-border)' }}
              >
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => currentIndex > 0 && setSelected(sideProjects[currentIndex - 1])}
                    disabled={currentIndex === 0}
                    className="btn-capsule-icon"
                    aria-label="Previous project"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>

                  <button onClick={() => setSelected(null)} className="btn-capsule">
                    Close
                  </button>

                  <button
                    onClick={() => currentIndex < sideProjects.length - 1 && setSelected(sideProjects[currentIndex + 1])}
                    disabled={currentIndex === sideProjects.length - 1}
                    className="btn-capsule-icon"
                    aria-label="Next project"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}
        </GridBottomSheet>
      </div>
    </motion.div>
  )
}