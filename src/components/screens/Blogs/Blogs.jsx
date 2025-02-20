import React, { useState } from 'react';
import './blogs.css';
import Footer from '../../Footer/Footer';
import Header from '../../Header/Header';
import tipsfirst from './../../../assests/images/tipsforfirsttimebuyers1.jpg'
import Smart from './../../../assests/images/Smart-real-estate-investment1.jpg'
import rightproperty from './../../../assests/images/rightproperty1.jpg'
import market from './../../../assests/images/realesate market1.jpg'
import impression from './../../../assests/images/impression home1.jpg'

const Blogs = () => {
  const [expandedBlog, setExpandedBlog] = useState(null);

  const toggleContent = (index) => {
    setExpandedBlog(expandedBlog === index ? null : index);
  };

  return (
    <>
      <Header />
      <div className="blogs">
        <h1 autoFocus >Our Latest Real Estate Insights</h1>
        <div className="blog-list">
          <div className="blog-item">
            <img autoFocus src={tipsfirst} alt="First Time Homebuyers" />
            <h2  autoFocus  >Tips for First-Time Homebuyers</h2>
            <p>
              Buying a home for the first time can be overwhelming. In this blog, we provide essential tips to help first-time homebuyers make informed decisions and navigate the buying process smoothly.
            </p>
            {expandedBlog === 0 && (
              <p>
                Further details: Navigating the homebuying process involves understanding the market, your budget, and your preferences. Here are some tips: Research areas, work with a real estate agent, and understand your financing options to make informed decisions.
              </p>
            )}
           <a href="#" onClick={(e) => { e.preventDefault(); toggleContent(0); }}>
  {expandedBlog === 0 ? 'Show Less' : 'Read More'}
</a>

          </div>

          <div className="blog-item">
            <img src={Smart} alt="Investing in Real Estate" />
            <h2>Why Investing in Real Estate is a Smart Move</h2>
            <p>
              Real estate has always been one of the safest investment options. In this article, we dive into the reasons why investing in real estate could secure your financial future.
            </p>
            {expandedBlog === 1 && (
              <p>
                Further details: Real estate investments provide long-term stability. You can rent properties to generate passive income, or invest in properties that appreciate in value over time, ensuring financial security and wealth building.
              </p>
            )}
           <a href="#" onClick={(e) => { e.preventDefault(); toggleContent(1); }}>
  {expandedBlog === 1 ? 'Show Less' : 'Read More'}
</a>

          </div>

          <div className="blog-item">
            <img src={rightproperty} alt="Choosing Property for Family" />
            <h2>How to Choose the Right Property for Your Family</h2>
            <p>
              Finding the perfect home for your family is a crucial decision. We discuss the important factors to consider, from location to amenities, that will ensure you choose the best property for your loved ones.
            </p>
            {expandedBlog === 2 && (
              <p>
                Further details: When choosing a property, consider factors such as proximity to schools, safety, transportation, and future value. It's important to understand the long-term needs of your family when making this significant decision.
              </p>
            )}
            <a href="#" onClick={(e) => { e.preventDefault(); toggleContent(2); }}>
  {expandedBlog === 2 ? 'Show Less' : 'Read More'}
</a> 
          </div>

          <div className="blog-item">
            <img src={market} alt="Market Trends in Real Estate" />
            <h2>Understanding Market Trends in Real Estate</h2>
            <p>
              Real estate market trends are constantly changing. Stay ahead of the curve by understanding the latest market shifts and how they impact your buying and selling decisions.
            </p>
            {expandedBlog === 3 && (
              <p>
                Further details: Knowing the latest market trends allows buyers and sellers to make smarter decisions. Look for market signals, interest rates, and regional demand shifts to guide your investment or sale decisions.
              </p>
            )}
            <a href="#" onClick={(e) => { e.preventDefault(); toggleContent(3); }}>
  {expandedBlog === 3 ? 'Show Less' : 'Read More'}
</a>

          </div>

          <div className="blog-item">
            <img src={impression} alt="Curb Appeal in Selling Home" />
            <h2>The Importance of Curb Appeal in Selling Your Home</h2>
            <p>
              When selling your home, first impressions matter. We share tips on enhancing your home's curb appeal to attract potential buyers and get the best offer.
            </p>
            {expandedBlog === 4 && (
              <p>
                Further details: Simple changes like landscaping, fresh paint, and maintaining the exterior can significantly boost your home's appeal. These enhancements can increase your chances of attracting offers quickly and at a good price.
              </p>
            )}
            <a href="#" onClick={(e) => { e.preventDefault(); toggleContent(4); }}>
  {expandedBlog === 4 ? 'Show Less' : 'Read More'}
</a>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Blogs;
