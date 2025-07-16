#include "contour_finder.h"

extern "C" {
Contour *find_contours(uint8_t *pixelData, size_t width, size_t height) {
  // std::cout << "width :" << width << "\nheight :" << height << std::endl;

  cv::Mat rgba(height, width, CV_8UC4, pixelData);

  // Split RGBA channels
  std::vector<cv::Mat> channels;
  cv::split(rgba, channels); // channels[3] is alpha

  // Threshold the alpha channel to create a binary mask
  cv::Mat binary;
  cv::threshold(channels[0], binary, 0, 255, cv::THRESH_BINARY);

  // Find contours
  std::vector<std::vector<cv::Point>> contours;
  cv::findContours(binary, contours, cv::RETR_EXTERNAL,
                   cv::CHAIN_APPROX_SIMPLE);

  // for (const auto &contour : contours) {
  //   printf("Contour:\n");
  //   for (const auto &pt : contour) {
  //     printf("  (%d, %d)\n", pt.x, pt.y);
  //   }
  // }

  Contour *result = new Contour[contours.size()];
  for (size_t i = 0; i < contours.size(); i++) {
    result[i].num_pts = contours[i].size();
    result[i].pts = new ContourVertex[result[i].num_pts];
    for (size_t j = 0; j < contours[i].size(); j++) {
      result[i].pts[j].x = contours[i][j].x;
      result[i].pts[j].y = contours[i][j].y;
    }
  }
  // printf("Found %zu contour(s)\n", contours.size());
  return result;
}
}