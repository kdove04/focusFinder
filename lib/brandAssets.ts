/**
 * Remote imagery: Gibbs-Green hero from Wikimedia Commons; gallery includes official jsums.edu
 * photos. Footer and UI credit sources. Official JSU trademark use may require approval from
 * University Communications (see https://www.jsums.edu/universitycommunications/application-for-logo-usage/).
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
    src: "https://www.jsums.edu/wp-content/uploads/2024/01/Library-1.jpg",
    alt: "H.T. Sampson Library at Jackson State University",
    caption: "H.T. Sampson Library",
    credit: "Jackson State University",
    license: "jsums.edu",
    licenseUrl: "https://www.jsums.edu/",
  },
  {
    src: "https://www.jsums.edu/studentlifeoperations/files/2023/06/SC-New-View-2-1240x600-1.jpg",
    alt: "JSU Student Center and Welcome Center building at Jackson State University",
    caption: "JSU Student Center",
    credit: "Jackson State University",
    license: "jsums.edu",
    licenseUrl: "https://www.jsums.edu/",
  },
];
