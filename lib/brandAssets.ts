/**
 * Remote imagery from Wikimedia Commons. Footer and UI credit the authors and licenses.
 * Official JSU trademark use may require approval from University Communications
 * (see https://www.jsums.edu/universitycommunications/application-for-logo-usage/).
 */

export const jsuLogo = {
  src: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Jackson_State_University_logo.png/400px-Jackson_State_University_logo.png",
  width: 400,
  height: 125,
  alt: "Jackson State University wordmark",
  commonsUrl:
    "https://commons.wikimedia.org/wiki/File:Jackson_State_University_logo.png",
} as const;

export type CampusPhoto = {
  src: string;
  alt: string;
  caption: string;
  credit: string;
  license: string;
  licenseUrl: string;
};

export const campusPhotos: CampusPhoto[] = [
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Entrance_of_the_Gibbs-Green_Memorial_Plaza_%40_Jackson_State_University.jpg/1280px-Entrance_of_the_Gibbs-Green_Memorial_Plaza_%40_Jackson_State_University.jpg",
    alt: "Entrance of the Gibbs-Green Memorial Plaza at Jackson State University",
    caption: "Gibbs-Green Memorial Plaza",
    credit: "2C2K Photography",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Rose_Embly_McCoy_Auditorium_%40_JSU.jpg/1280px-Rose_Embly_McCoy_Auditorium_%40_JSU.jpg",
    alt: "Rose Embly McCoy Auditorium at Jackson State University",
    caption: "Rose Embly McCoy Auditorium",
    credit: "2C2K Photography",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/JSUdowntown.JPG/1280px-JSUdowntown.JPG",
    alt: "Jackson State University downtown office tower on Capitol Street",
    caption: "Downtown Jackson — JSU Institute of Government",
    credit: "Comingdeer",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
];
