// Import default image for flats
import defaultImage from './../../assests/images/homebanner.webp';
import defaultImage1 from './../../assests/images/homebanner1.webp';

export const locations = {
    Telangana: [
      {  city: "Hyderabad", bhkType: "2BHK", constructionStatus: "Ready to Move", image: defaultImage },
      {  city: "Warangal", bhkType: "1BHK", constructionStatus: "Under Construction", image: defaultImage1 },
      {  city: "Karimnagar", bhkType: "3BHK", constructionStatus: "Ready to Move", image: 'path_to_image3.webp' },
      {  city: "nari", bhkType: "1BHK", constructionStatus: "Ready to Move", image: 'path_to_image3.webp' }

    ],
    Karnataka: [
      {  city: "Bangalore", bhkType: "3BHK", constructionStatus: "Ready to Move", image: 'path_to_image4.webp' },
      {  city: "Mysore", bhkType: "2BHK", constructionStatus: "New Launch", image: 'path_to_image5.webp' },
      {  city: "Hubli", bhkType: "4BHK", constructionStatus: "Under Construction", image: 'path_to_image6.webp' }
    ],
    Maharashtra: [
      {  city: "Mumbai", bhkType: "2BHK", constructionStatus: "Ready to Move", image: 'path_to_image7.webp' },
      {  city: "Pune", bhkType: "1BHK", constructionStatus: "New Launch", image: 'path_to_image8.webp' },
      {  city: "Nagpur", bhkType: "3BHK", constructionStatus: "Under Construction", image: 'path_to_image9.webp' }
    ],
    TamilNadu: [
      {  city: "Chennai", bhkType: "2BHK", constructionStatus: "Ready to Move", image: 'path_to_image10.webp' },
      {  city: "Coimbatore", bhkType: "3BHK", constructionStatus: "Under Construction", image: 'path_to_image11.webp' },
      { city: "Madurai", bhkType: "4BHK", constructionStatus: "New Launch", image: 'path_to_image12.webp' }
    ]
    ,
    // Pune: [
    //   { id: 13, city: "nari", bhkType: "2BHK", constructionStatus: "Ready to Move", image: 'path_to_image10.webp' },
    //   { id: 14, city: "hello", bhkType: "3BHK", constructionStatus: "Under Construction", image: 'path_to_image11.webp' },
    //   { id: 15, city: "hii", bhkType: "4BHK", constructionStatus: "New Launch", image: 'path_to_image12.webp' }
    // ]
  };
  