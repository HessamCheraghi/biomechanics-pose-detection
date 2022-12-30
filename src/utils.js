// eslint-disable-next-line no-unused-vars
import * as tf from "@tensorflow/tfjs";
import * as posenet from "@tensorflow-models/posenet";
import * as poseDetection from "@tensorflow-models/pose-detection";

const color = "aqua";
const lineWidth = 2;

function isAndroid() {
  return /Android/i.test(navigator.userAgent);
}

function isiOS() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function isMobile() {
  return isAndroid() || isiOS();
}

function toTuple({ y, x }) {
  return [y, x];
}

// eslint-disable-next-line no-shadow
export function drawPoint(ctx, y, x, r, color) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
}

// eslint-disable-next-line no-shadow
export function drawSegment([ay, ax], [by, bx], color, scale, ctx) {
  ctx.beginPath();
  ctx.moveTo(ax * scale, ay * scale);
  ctx.lineTo(bx * scale, by * scale);
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = color;
  ctx.stroke();
}

export function drawSkeleton(keypoints, minConfidence, ctx, scale = 1) {
  const adjacentKeyPoints = posenet.getAdjacentKeyPoints(
    keypoints,
    minConfidence
  );

  // eslint-disable-next-line no-shadow
  adjacentKeyPoints.forEach((keypoints) => {
    drawSegment(
      toTuple(keypoints[0]),
      toTuple(keypoints[1]),
      color,
      scale,
      ctx
    );
  });
}

export function drawKeypoints(keypoints, minConfidence, ctx, scale = 1) {
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < keypoints.length; i++) {
    const keypoint = keypoints[i];

    if (keypoint.score < minConfidence) {
      // eslint-disable-next-line no-continue
      continue;
    }

    const { y, x } = keypoint;
    drawPoint(ctx, y * scale, x * scale, 3, color);
  }
}

export async function drawCanvas(
  pose,
  videoWidth,
  videoHeight,
  canvasRef,
  options
) {
  const ctx = canvasRef.current.getContext("2d");
  // eslint-disable-next-line no-param-reassign
  canvasRef.current.width = videoWidth;
  // eslint-disable-next-line no-param-reassign
  canvasRef.current.height = videoHeight;
  if (options.showDots) drawKeypoints(pose.keypoints, 0.4, ctx);
  if (options.showLines) drawSkeleton(pose.keypoints, 0.4, ctx);
}

export function angleCalculator(x1, x2, y1, y2) {
  const deltaY = y1 - y2; // in the browser y axis is downwards
  const deltaX = x2 - x1;
  const angle = (Math.atan2(deltaY, deltaX) / Math.PI) * 180;
  return angle < 0 ? angle + 360 : angle; // return the positive value for angle
}

export function calculate(pose, calculationsRef, options) {
  if (!options.showAngles) return;
  const rightElbowAngle = angleCalculator(
    pose.keypoints[8].x,
    pose.keypoints[10].x,
    pose.keypoints[8].y,
    pose.keypoints[10].y
  ).toFixed(2);

  const leftElbowAngle = angleCalculator(
    pose.keypoints[7].x,
    pose.keypoints[9].x,
    pose.keypoints[7].y,
    pose.keypoints[9].y
  ).toFixed(2);

  const rightShoulderAngle = angleCalculator(
    pose.keypoints[6].x,
    pose.keypoints[8].x,
    pose.keypoints[6].y,
    pose.keypoints[8].y
  ).toFixed(2);
  const leftShoulderAngle = angleCalculator(
    pose.keypoints[5].x,
    pose.keypoints[7].x,
    pose.keypoints[5].y,
    pose.keypoints[7].y
  ).toFixed(2);

  const text = `زاویه آرنج چپ: °${leftElbowAngle}\t\t زاویه آرنج راست: °${rightElbowAngle}\n زاویه شانه چپ: °${leftShoulderAngle}\t\t زاویه شانه راست: °${rightShoulderAngle}`;
  // eslint-disable-next-line no-param-reassign
  calculationsRef.current.textContent = text;
}

export const detectorConfig = {
  modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
};

let detector = null;

export async function detect(webcamRef, canvasRef, calculationsRef, options) {
  if (
    typeof webcamRef.current !== "undefined" &&
    webcamRef.current !== null &&
    webcamRef.current.video.readyState === 4 &&
    detector !== null
  ) {
    const { video } = webcamRef.current;
    const { videoWidth } = webcamRef.current.video;
    const { videoHeight } = webcamRef.current.video;
    // eslint-disable-next-line no-param-reassign
    webcamRef.current.video.width = videoWidth;
    // eslint-disable-next-line no-param-reassign
    webcamRef.current.video.height = videoHeight;

    const [pose] = await detector.estimatePoses(video);

    // console.log(pose);
    drawCanvas(pose, videoWidth, videoHeight, canvasRef, options);
    calculate(pose, calculationsRef, options);
  }
}
(async function main() {
  detector = await poseDetection.createDetector(
    poseDetection.SupportedModels.MoveNet,
    detectorConfig
  );
})().catch();
