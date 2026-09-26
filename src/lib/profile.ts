// Career facts shown on the landing and about pages. Numbers here are the site's most
// quoted facts: keep them identical to the résumé PDF.

// Years since Sep 2021. Update each September; the hero readout and author box both use it.
export const yearsOfExperience = 5;

export interface Readout {
  value: string;
  unit: string;
  caption: string;
}

export const readouts: Readout[] = [
  {
    value: '400+',
    unit: 'stores',
    caption:
      'Retail stores running my detection and classification models on Raspberry Pi 5 edge devices, grown from 40+ pilots, with a 700-store rollout under contract.',
  },
  {
    value: '1,400+',
    unit: 'units a day',
    caption:
      'Units inspected per day by 4 manufacturing inspection stations I built and commissioned, in production for 1 year.',
  },
  {
    value: String(yearsOfExperience),
    unit: 'years',
    caption:
      'Of professional engineering since September 2021, including 3.5 years of real-time 3D and GPU performance work at PwC.',
  },
];

export const capabilities: string[] = [
  'Train detection, classification and anomaly models on real production imagery, from annotation through threshold calibration.',
  'Quantise and port models to ARM edge hardware, and rebuild pre- and post-processing so inference runs without the training framework.',
  'Build multi-camera RTSP (Real-Time Streaming Protocol) video pipelines and tracking-based KPIs that are checked against manual counts.',
  'Commission systems on site, and turn field failures into new validation data.',
];

export interface SkillGroup {
  group: string;
  items: string[];
}

export const skills: SkillGroup[] = [
  { group: 'Languages', items: ['Python', 'C#', 'JavaScript', 'SQL'] },
  {
    group: 'Computer vision',
    items: [
      'OpenCV',
      'object detection',
      'YOLOX',
      'image classification',
      'anomaly detection',
      'multi-object tracking',
      'Norfair',
      'ByteTrack',
      'supervision',
      'image segmentation',
      'homography and perspective transforms',
      'connected component analysis',
      'morphological operations',
      'Canny edge detection',
      'RTSP video pipelines',
    ],
  },
  {
    group: 'Machine learning',
    items: [
      'PyTorch',
      'ONNX',
      'ONNX Runtime',
      'NCNN',
      'dataset curation and annotation',
      'data augmentation',
      'training and evaluation',
      'mAP/precision/recall',
      'threshold calibration',
      'class-prior correction',
      'FP16 and INT8 quantization',
      'model export',
      'edge inference optimisation',
    ],
  },
  {
    group: 'Deployment',
    items: [
      'Docker',
      'docker-compose',
      'NVIDIA CUDA',
      'GPU inference',
      'ARM64',
      'Raspberry Pi 5',
      'edge deployment',
      'Flask',
      'REST APIs',
      'SQLite',
      'Litestream',
      'AWS S3',
      'systemd',
      'Linux',
      'cron',
      'Git',
      'uv',
      'Ruff',
    ],
  },
  {
    group: 'Real-time 3D',
    items: [
      'Unity',
      'URP',
      'GPU and CPU profiling',
      '3D asset optimisation',
      'Meta Quest',
      'hand tracking',
      'IL2CPP',
    ],
  },
];

// The résumé summary, verbatim from the PDF so the two stay consistent.
export const summary =
  'Computer vision engineer who trains detection, classification and anomaly models and ships them into production on real hardware. Work is live in 400+ retail stores on edge devices and on 4 manufacturing inspection stations processing 1,400+ units per day, covering dataset creation, model training, quantization for ARM edge inference, the serving layer and on-site commissioning. Previously spent three and a half years on real-time 3D and GPU performance engineering.';

export interface RoleProject {
  name: string;
  // Matches a project MDX id when a case study exists.
  caseStudy?: string;
  context: string;
  highlights: string[];
}

export interface Role {
  role: string;
  org: string;
  location: string;
  start: { iso: string; label: string };
  end: { iso: string; label: string } | null;
  summary: string;
  projects?: RoleProject[];
  highlights?: string[];
}

export const experience: Role[] = [
  {
    role: 'Software Engineer',
    org: 'Xenvis Solutions',
    location: 'Bengaluru, India',
    start: { iso: '2025-01', label: 'Jan 2025' },
    end: null,
    summary:
      'Trains and ships computer vision models for retail edge analytics and factory visual inspection.',
    projects: [
      {
        name: 'Retail Edge Analytics',
        caseStudy: 'retail-edge-analytics',
        context:
          'On-device store analytics, 400+ stores live from 40+ pilot deployments, 700-store rollout in contract.',
        highlights: [
          'Trained a YOLOX-S person detector and a dual-head MobileNetV3-Small crop classifier (demographic and customer/employee heads) on 25,000 annotated store-camera frames, reaching 0.90 mAP@0.5 and 92% classification accuracy on held-out footage.',
          'Quantized both models to FP16 and migrated inference from ONNX Runtime to NCNN for ARM64, re-exporting the detector at 352×352 and reimplementing the full pre- and post-processing chain in NumPy (centred letterbox, space-to-depth Focus stem, raw-head grid decode, non-maximum suppression), removing the PyTorch runtime dependency and cutting inference latency by 35% and model size by 45% on Raspberry Pi 5.',
          'Diagnosed and fixed a silent production failure in which the NCNN detector received the wrong input tensor and every box decoded to roughly one pixel, disabling three KPIs without raising an error, restoring parity with the FP32 baseline by rebuilding the decode path and verifying box geometry against reference outputs.',
          'Architected the multi-camera pipeline to run detection and classification once per RTSP feed and share results across all KPIs on that camera, and partitioned the Pi’s four cores into dedicated NCNN pipelines, eliminating periodic 2× loop-latency spikes and holding 90 ms median inference per camera.',
          'Built six real-time KPIs on multi-object tracking (Norfair and ByteTrack): footfall entry/exit, passerby, trial-room usage, billing-counter and greeting-zone activity, and movement heatmaps accumulated once per track per normalised grid cell.',
          'Replaced naive line-crossing with a config-derived inner-boundary rule, resolution-relative gate buffers and union-find group clustering, rejecting through-glass and threshold loitering and reaching 94% agreement with manual counts.',
          'Corrected a systematic demographic-classifier bias using prior-shift reweighting derived from manual audits of 451 people across five observation windows, where the raw head predicted 39% male against 75% actual.',
          'Tightened employee exclusion to require sustained high-confidence evidence after noisy majority voting discarded roughly 18% of genuine entrants, and lowered the detector confidence threshold from 0.45 to 0.30 after validating recovery of backlit doorway detections on store footage.',
          'Built the data and operations layer: daily partitioned SQLite databases with retention, continuous replication to S3 via Litestream, host-level connectivity heartbeats for fleet monitoring, a cron sales sync for conversion metrics, and a browser zone-annotation tool plus React dashboard for store staff.',
        ],
      },
      {
        name: 'Automated Visual Inspection',
        caseStudy: 'automated-visual-inspection',
        context:
          'Electronics manufacturing line, 4 stations, 1,400+ units inspected per day, 1 year in production.',
        highlights: [
          'Trained YOLOX-S and YOLOX-M detectors on 2,500 annotated production images across 6 component and defect classes, reaching 0.96 mAP@0.5, and trained a seal-anomaly classifier on 9,000 normal and 1,500 anomalous rim patches to 94% precision and 96% recall at the deployed threshold.',
          'Built a GPU-backed Flask inference service containerised on CUDA 12.8 that routes three product variants to dedicated pipelines and returns a pass/fail verdict with an annotated image, loading all models once at startup to hold median latency at 1,200 ms per unit.',
          'Engineered the seal pipeline in OpenCV: mean-shift colour quantisation, HSV segmentation, homography alignment to a fixed frame, then batched ONNX classification of 36 rim ROIs with consecutive-failure aggregation.',
          'Eliminated a systematic false-pass mode in which misalignment placed ROIs on background, adding pixel-ratio and ROI-coverage gates plus a geometric seating check built on connected components, min-area-rect fitting and a distance transform, all calibrated on labelled OK and NOK samples.',
          'Commissioned all four stations on site across phased deployments, resolving lighting, alignment and false-reject issues directly with the plant floor manager and converting field failures into new validation samples.',
        ],
      },
    ],
  },
  {
    role: 'Associate 2',
    org: 'PwC',
    location: 'Bengaluru, India',
    start: { iso: '2023-01', label: 'Jan 2023' },
    end: { iso: '2025-01', label: 'Jan 2025' },
    summary:
      'Built real-time 3D shopfloor training modules for a global energy-management manufacturer, sustained at 60 FPS at 1080p.',
    highlights: [
      'Designed a data-driven module and step framework that let eight shopfloor learning modules share one shell, navigation and validation pipeline for a global energy-management manufacturer.',
      'Built the interactive 3D task layer with drag-and-drop sorting into rework and scrap bins, part-number label-to-bin matching validated per socket, and click-to-identify error tasks revealing the correct floor-marking standard.',
      'Implemented coverage-based task grading, sampling a surface mask under swipe input to drive a live completion percentage, feeding an auto-evaluating daily standards checklist beside a live 3D viewport.',
      'Tuned real-time render performance to a sustained 60 FPS at 1080p using GPU instancing, static batching, LOD groups and baked lightmaps, cutting draw calls by 58%.',
      'Cut scene triangle count by 40% and build size by 30% through mesh decimation on supplied CAD assets, texture atlasing, compression and Addressables-packed module content.',
      'Ported the PPE kit-wearing module to Meta Quest as a standalone Android build with hand-tracked grab and snap-socket placement, automated the Windows x64 IL2CPP and APK release pipeline, and maintained both shipped products through their post-delivery support windows.',
    ],
  },
  {
    role: 'Associate',
    org: 'PwC',
    location: 'Bengaluru, India',
    start: { iso: '2021-09', label: 'Sep 2021' },
    end: { iso: '2023-01', label: 'Jan 2023' },
    summary:
      'Optimised standalone mobile XR rendering to a sustained 72 Hz within a 13.9 ms frame budget.',
    highlights: [
      'Optimised a Universal Render Pipeline (URP) renderer for standalone mobile hardware using Single-Pass Instanced stereo rendering, fixed foveated rendering and dynamic resolution scaling, sustaining 72 Hz within a 13.9 ms frame budget.',
      'Reduced draw calls by 62% and scene triangle count by 58% through SRP Batcher adoption, GPU instancing, mesh decimation, LOD groups and baked lighting with occlusion culling.',
      'Profiled CPU and GPU hotspots with Unity Profiler and OVR Metrics Tool, then removed per-frame allocations via object pooling and event-driven updates to eliminate garbage-collection spikes during step transitions.',
      'Architected a data-driven step graph for a 23-step industrial standard operating procedure with per-step validation and event-driven progression, serving guided and unassisted assessment modes from one content pipeline.',
      'Engineered controller-free interaction on hand tracking: poke input on panel buttons, grab-and-rotate transformers with angle thresholds on manual valves, snap-target tool placement and tag decal application.',
      'Recreated an industrial human machine interface as tabbed nested canvases with a state-coloured P&ID schematic and interlock-style gating, and integrated weighted pass/fail scoring posted over REST to a supervisor dashboard.',
    ],
  },
];

export const education = {
  institution: 'KLE Technological University',
  location: 'Hubballi, India',
  degree: 'B.E. in Electrical and Electronics Engineering',
  start: { iso: '2017-08', label: 'Aug 2017' },
  end: { iso: '2021-07', label: 'Jul 2021' },
  grade: 'CGPA 7.5/10',
  coursework: [
    'Machine Learning',
    'Deep Learning',
    'Object Oriented Programming',
    'Data Structures and Algorithms',
  ],
};

export const awards: { title: string; detail: string }[] = [
  {
    title: 'Certificate of Excellence, The Solvers Challenge 2023–24',
    detail: 'Recognised for innovation and execution.',
  },
  {
    title: 'Human Centred Design and Digital Acumen badges',
    detail: 'Design fundamentals, agile methods and data-driven problem solving.',
  },
];
