#include "contour_finder.h"

extern "C" {
EMSCRIPTEN_KEEPALIVE
std::vector<std::vector<cv::Point>>
process_alpha_contours(uint8_t *pixelData, int width, int height) {
  // Create cv::Mat from raw RGBA buffer
  cv::Mat image(height, width, CV_8UC4, pixelData);

  // Extract alpha channel
  std::vector<cv::Mat> channels;
  cv::split(image, channels); // channels[3] is alpha

  // Threshold alpha to get a binary mask
  cv::Mat binary;
  cv::threshold(channels[3], binary, 0, 255, cv::THRESH_BINARY);

  // Find contours
  std::vector<std::vector<cv::Point>> contours;
  cv::findContours(binary, contours, cv::RETR_EXTERNAL,
                   cv::CHAIN_APPROX_SIMPLE);

  // Log how many contours were found
  printf("Found %zu contour(s)\n", contours.size());

  return contours;
}
}