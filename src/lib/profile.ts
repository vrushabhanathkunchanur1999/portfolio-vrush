// Career facts shown on the landing and about pages. Numbers here are the site's most
// quoted facts: keep them identical to the résumé PDF.

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
    value: '5',
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

export interface Role {
  role: string;
  org: string;
  start: { iso: string; label: string };
  end: { iso: string; label: string } | null;
  summary: string;
}

export const experience: Role[] = [
  {
    role: 'Software Engineer',
    org: 'Xenvis Solutions',
    start: { iso: '2025-01', label: 'Jan 2025' },
    end: null,
    summary:
      'Trains and ships computer vision models for retail edge analytics and factory visual inspection.',
  },
  {
    role: 'Associate 2',
    org: 'PwC',
    start: { iso: '2023-01', label: 'Jan 2023' },
    end: { iso: '2025-01', label: 'Jan 2025' },
    summary:
      'Built real-time 3D shopfloor training modules for a global energy-management manufacturer, sustained at 60 FPS at 1080p.',
  },
  {
    role: 'Associate',
    org: 'PwC',
    start: { iso: '2021-09', label: 'Sep 2021' },
    end: { iso: '2023-01', label: 'Jan 2023' },
    summary:
      'Optimised standalone mobile XR rendering to a sustained 72 Hz within a 13.9 ms frame budget.',
  },
];
