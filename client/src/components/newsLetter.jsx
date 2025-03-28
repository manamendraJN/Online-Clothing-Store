import React from "react";

export default function newsLetter() {
  return (
    <div>
      <div className="mx-auto container py-16 px-6 ">
        <div className="flex flex-col lg:flex-row justify-center items-center xl:space-x-44 lg:space-x-24 space-y-8 lg:space-y-0">
          <div className="md:px-12 lg:px-0 flex flex-col justify-start items-start lg:w-2/5 xl:w-3/12">
            <div>
              <p className="text-sm leading-3 text-gray-600">
                Subscribe to our newsletter
              </p>
            </div>
            <div className="xl:mt-4 mt-2">
              <p className="text-4xl font-semibold leading-9 text-gray-800">
                Join Our Mailing List
              </p>
            </div>
            <div className="xl:mt-6 mt-4">
              <p className="text-base leading-6 text-gray-600">
                Subscribe to our newsletter to stay in the loop. Our newsletter
                is sent once in a week on every friday to get latest news and
                updates.
              </p>
            </div>
            <div className="xl:mt-12 mt-6 w-full">
              <input
                className="focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2 pb-1 border border-gray-600 w-full h-12 sm:w-96 md:w-full lg:w-72 px-4 text-base leading-4 text-gray-600 placeholder-gray-600"
                placeholder="Email address"
                type="email"
                name="input"
              />
            </div>
            <div className="xl:mt-4 mt-2 w-full">
              <button className="focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 h-12 w-full sm:w-96 md:w-full lg:w-72 bg-orange-700 hover:bg-orange-500 hover:rounded-full text-base font-medium leading-4 text-white">
                Subscribe
              </button>
            </div>
          </div>
          <div>
            <img
              src="https://img.freepik.com/free-photo/two-young-beautiful-blond-smiling-hipster-women-trendy-summer-clothes-sexy-carefree-women-posing-near-blue-wall-sunglasses-positive-models-going-crazy-hugging_158538-7650.jpg?t=st=1712748800~exp=1712752400~hmac=6b58eb60fb1f81ad44cc173b9480d61a838c7df3cd8280191ba41f4140fae604&w=1060"
              alt="girl"
              className=" rounded-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
