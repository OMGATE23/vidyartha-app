import React, { useEffect, useState } from "react";

const Analytics = () => {
  const [analytics, setAnalytics] = useState();

  async function fetchAnalytics() {
    try {
      const response = await fetch(
        "https://api.vidyartha.org/shastradaan/dashboard/"
      );
      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchAnalytics();
  } , []);
  return (
    <>
      {analytics && (
        <div className="analytics">
          <div>
            <img src="./new-assets/fundraiser-icon-1.svg" />
            <p className="analytics-title">Current Fundraisers</p>
            <p className="analytics-num">100+</p>
          </div>
          <div>
            <img src="./new-assets/fundraiser-icon-2.svg" />
            <p className="analytics-title">Unique Donors</p>
            <p className="analytics-num">{analytics.totalUniqueDonors}</p>
          </div>
          <div>
            <img src="./new-assets/books-donated-icon.svg" />
            <p className="analytics-title">Books donated</p>
            <p className="analytics-num">100+</p>
          </div>
          <div>
            <img src="./new-assets/money-raised-icon.svg" />
            <p className="analytics-title">Money raised</p>
            <p className="analytics-num">Rs. {analytics.totalDonationAmount}</p>
          </div>
          <div>
            <img src="./new-assets/books-donated-icon.svg" />
            <p className="analytics-title">Schools helped</p>
            <p className="analytics-num">100+</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Analytics;
