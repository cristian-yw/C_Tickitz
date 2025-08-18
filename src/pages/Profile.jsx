import { useState } from "react";
import { useContext } from "react";
import OrderContext from "../Context/OrderContext";
import CardHistory from "../components/ProfileHistory.jsx";

function Profile() {
  const [toggleModal, setToggleModal] = useState(false);
  const [isDetailOrHistory, setDetailOrHistory] = useState(true);
  const { allOrder } = useContext(OrderContext);

  const dummydata = {
    first: "Jonas El",
    last: "Rodriguez",
    email: "jonasrodri123@gmail.com",
    hp: "081445687121",
    pwd: "admin@123",
  };

  return (
    <>
      {/* navigation switch on mobile */}
      <div className="flex w-full flex-row justify-around bg-white shadow-md shadow-black md:hidden">
        <span
          className={`${
            isDetailOrHistory &&
            "border-blue-primary block border-b-2 text-black"
          } p-4 text-[#AAAAAA]`}
          onClick={() => setDetailOrHistory(true)}
        >
          Details Account
        </span>
        <span
          className={`${
            !isDetailOrHistory &&
            "border-blue-primary block border-b-2 text-black"
          } p-4 text-[#AAAAAA]`}
          onClick={() => setDetailOrHistory(false)}
        >
          Order History
        </span>
      </div>

      <main className="bg-background h-max justify-center md:flex md:flex-row md:p-5">
        {/* profile info */}
        <aside
          className={`${
            !isDetailOrHistory && "hidden"
          } flex flex-col items-center p-8 md:block md:w-96`}
        >
          <div className="w-full min-w-3xs rounded-t-lg border-b border-gray-200 bg-white p-8 shadow-md">
            <div className="mt-3 flex flex-row justify-between">
              <span>INFO</span>
              <img
                src="/eva_more-horizontal-fill.svg"
                className="hidden h-7 w-7 md:block"
                alt="threedot"
              />
            </div>
            <div className="flex flex-col items-center gap-2">
              <img
                className="h-[136px] w-[136px] rounded-full shadow-md"
                src="/Ellipse_11.png"
                alt="profile_page"
              />
              <span className="text-xl font-semibold text-[#14142B]">
                {dummydata.first} {dummydata.last}
              </span>
              <span className="text-xs text-[#4E4B66]">Moviegoers</span>
            </div>
          </div>
          <div className="flex w-full min-w-3xs flex-col gap-4 rounded-b-lg border-t border-gray-200 bg-white p-8 shadow-md">
            <span className="text-base text-[#4E4B66]">Loyalty Points</span>
            <div className="relative h-32 max-w-64 rounded-xl bg-[#1D4ED8]">
              <div className="absolute top-[-63px] right-[-20px] h-32 w-32 rounded-full bg-[#FFFFFF4D]"></div>
              <div className="absolute top-[-20px] right-[-50px] h-32 w-32 rounded-full bg-[#FFFFFF4D]"></div>
              <img
                className="absolute top-0 right-0 h-[63px] w-[63px]"
                src="/eva_star-fill.png"
                alt="icon_star"
              />
              <span className="absolute top-5 left-4 text-xs text-white">
                Moviegoers
              </span>
              <span className="absolute bottom-5 left-4 text-2xl text-white">
                320<span className="text-[10px]">points</span>
              </span>
            </div>

            <span className="text-[16px] text-[#4E4B66]">
              180 points become a master
            </span>
            <div className="h-4 w-full rounded-xl bg-white shadow-[inset_0_2px_8px_gray]">
              <div className="h-4 w-[50%] rounded-xl bg-[#1D4ED8]"></div>
            </div>
            <span
              className="block w-full rounded-2xl border border-[#1D4ED8] p-4 text-center text-[#1D4ED8] md:hidden"
              onClick={() => setToggleModal(!toggleModal)}
            >
              Edit profile
            </span>
          </div>
        </aside>

        {/* modal bg */}
        <div
          className={`${
            !toggleModal && "hidden"
          } fixed inset-0 bg-[rgb(0,0,0,0.8)]`}
          onClick={() => setToggleModal(!toggleModal)}
        ></div>

        <section
          className={`flex flex-col gap-6 p-8 md:m-[28px] md:gap-5 md:p-0`}
        >
          {/* navigation on desktop */}
          <div className="hidden md:mb-5 md:flex md:max-w-3xl md:flex-row md:rounded-xl md:bg-white md:pl-4 md:shadow-md">
            <span
              className={`${
                isDetailOrHistory && "border-blue-primary border-b-2 text-black"
              } block p-4 text-[#AAAAAA]`}
              onClick={() => setDetailOrHistory(true)}
            >
              Details Account
            </span>
            <span
              className={`${
                !isDetailOrHistory &&
                "border-blue-primary border-b-2 text-black"
              } block p-4 text-[#AAAAAA]`}
              onClick={() => setDetailOrHistory(false)}
            >
              Order History
            </span>
          </div>

          {/* detail account section */}
          <section
            className={`${
              !isDetailOrHistory && "hidden md:hidden"
            } md:flex md:flex-col md:gap-5`}
          >
            {/* modal form */}
            <div
              className={`${
                !toggleModal && "hidden"
              } w-2xs rounded-xl bg-white p-4 md:flex md:w-full md:flex-col md:gap-5`}
            >
              <span className="text-2xl font-bold md:hidden">
                Account Settings
              </span>
              <div className="flex flex-col gap-5 bg-white md:rounded-xl md:p-5 md:shadow-md">
                <span className="block w-full border-b border-gray-300 p-1">
                  Detail Information
                </span>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-base text-[#4E4B66]">
                      First Name
                    </label>
                    <input
                      className="w-full rounded-md border border-gray-300 p-2"
                      type="text"
                      defaultValue={dummydata.first}
                    />
                  </div>
                  <div>
                    <label className="text-base text-[#4E4B66]">
                      Last Name
                    </label>
                    <input
                      className="w-full rounded-md border border-gray-300 p-2"
                      type="text"
                      defaultValue={dummydata.last}
                    />
                  </div>
                  <div>
                    <label className="text-base text-[#4E4B66]">Email</label>
                    <input
                      className="w-full rounded-md border border-gray-300 p-2"
                      type="text"
                      defaultValue={dummydata.email}
                    />
                  </div>
                  <div>
                    <label className="text-base text-[#4E4B66]">
                      Phone Number
                    </label>
                    <input
                      className="w-full rounded-md border border-gray-300 p-2"
                      type="text"
                      defaultValue={dummydata.hp}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-5 bg-white md:rounded-xl md:p-5 md:shadow-md">
                <span className="block w-full border-b border-gray-300 p-1">
                  Account and Privacy
                </span>
                <div className="md:flex md:flex-row md:gap-5">
                  <div>
                    <label className="text-base text-[#4E4B66]">
                      New Password
                    </label>
                    <input
                      className="w-full rounded-md border border-gray-300 p-2"
                      type="password"
                      defaultValue={dummydata.pwd}
                    />
                  </div>
                  <div>
                    <label className="text-base text-[#4E4B66]">
                      Confirm Password
                    </label>
                    <input
                      className="w-full rounded-md border border-gray-300 p-2"
                      type="password"
                      defaultValue={dummydata.pwd}
                    />
                  </div>
                </div>
              </div>
              <span className="mt-5 block w-full rounded-lg bg-blue-800 p-4 text-center text-white md:w-80">
                Update Change
              </span>
            </div>
          </section>

          {/* order history section */}
          <section
            className={`${
              isDetailOrHistory && "hidden md:hidden"
            } flex flex-col gap-7`}
          >
            {allOrder.length > 0 ? (
              allOrder.map((history) => (
                <CardHistory
                  key={history.id}
                  dataHistory={{
                    movie_title: history.items.movieTitle,
                    date: `${history.items.date} - ${history.items.time}`,
                    category: history.items.category,
                    seat: history.items.seats.split(", "),
                    total: history.items.total,
                    place: history.items.cinema,
                    va: history.va,
                    is_paid: history.is_paid,
                    data: "/QR Code 1.svg",
                  }}
                />
              ))
            ) : (
              <p className="text-center text-gray-500">
                No order history found.
              </p>
            )}
          </section>
        </section>
      </main>
    </>
  );
}

export default Profile;
