import { useState } from "react";

function CardHistory({ dataHistory }) {
  const [toggleExp, setToggleExp] = useState(false);

  function logoCinema(place) {
    switch (place) {
      case "EBV.id":
        return "/ebv.id.png";
      case "CineOne21":
        return "/CineOne21.png";
      case "Hiflix":
        return "/hiflix_2.png";
      case "XXI":
        return "/ebv.id.png";
    }
  }

  function isPasDate(dataDate) {
    const cleanedString = dataDate.replace(/^.*?,\s*/, "").replace(" - ", " ");
    const thisdate = new Date(cleanedString);

    const now = new Date();
    return thisdate < now;
  }

  function dateFromData(getDate) {
    const cleanedString = getDate.replace(/^.*?,\s*/, "").replace(" - ", " ");
    const date = new Date(cleanedString);

    const day = date.getDate();
    const month = date.toLocaleString("id-ID", { month: "long" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }

  function timeFromData(getData) {
    const cleanedString = getData.replace(/^.*?,\s*/, "").replace(" - ", " ");
    const date = new Date(cleanedString);

    // const time = date.toLocaleTimeString([], {
    //   hour: "2-digit",
    //   minute: "2-digit",
    // });

    const time = date.toLocaleTimeString("en-US");

    return time;
  }

  return (
    <div className="flex flex-col">
      <div className="border-background flex flex-col gap-2.5 rounded-t-2xl bg-white p-5 shadow-md md:flex-row-reverse md:justify-between md:rounded-t-3xl">
        <img
          className="w-20 h-8"
          src={logoCinema(dataHistory.place)}
          alt={dataHistory.place}
        />
        <div className="flex flex-col gap-2.5">
          <span className="text-label text-[13px]">{dataHistory.date}</span>
          <span className="text-lg">{dataHistory.movie_title}</span>
        </div>
      </div>
      {/* if ticket active & unpaid */}
      <div className="border-background flex flex-col rounded-b-2xl bg-white p-5 shadow-md">
        <div className="flex flex-col items-center justify-between gap-5 md:flex-row">
          <div className="flex w-full flex-col items-center gap-5 md:flex-row">
            <span
              className={`${
                isPasDate(dataHistory.date)
                  ? "text-label bg-[#00BA8833]"
                  : "text-active bg-[#6E719133]"
              } w-full rounded-lg p-2.5 text-center md:w-44`}
            >
              {`${!dataHistory.is_paid ? "Ticket is Active" : "Ticket used"}`}
            </span>
            <span
              className={`${
                dataHistory.is_paid
                  ? "text-blue-primary bg-[rgba(29,78,216,0.2)]"
                  : "text-importan bg-[rgba(232,44,44,0.2)]"
              } block w-full rounded-lg p-2.5 text-center md:w-44`}
            >
              {dataHistory.is_paid ? "Paid" : "Not paid"}
            </span>
          </div>
          <span
            className="text-label block cursor-pointer text-center text-nowrap"
            onClick={() => setToggleExp(!toggleExp)}
          >
            Show Details
          </span>
        </div>
        <div className={`${!toggleExp && "hidden"} mt-5 flex flex-col gap-2.5`}>
          <div className="text-lg font-bold">Ticket Information</div>
          {dataHistory.is_paid ? (
            <div className="flex flex-col md:flex-row">
              <img
                className="w-32"
                src={dataHistory.data}
                alt={dataHistory.data}
              />
              <div className="grid grid-cols-3 gap-2.5">
                <div className="flex flex-col">
                  <span className="text-label text-[12px]">Category</span>
                  <span className="text-sm font-semibold">
                    {dataHistory.category}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-label text-[12px]">Time</span>
                  <span className="text-sm font-semibold">
                    {timeFromData(dataHistory.date)}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-label text-[12px]">Seats</span>
                  <span className="text-sm font-semibold">
                    {dataHistory.seat.map((seat) => `${seat}, `)}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-label text-[12px]">Movie</span>
                  <span className="truncate text-sm font-semibold">
                    {dataHistory.movie_title}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-label text-[12px]">Date</span>
                  <span className="text-sm font-semibold">
                    {dateFromData(dataHistory.date)}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-label text-[12px]">Count</span>
                  <span className="text-sm font-semibold">
                    {dataHistory.seat.length}
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-label text-[12px]">Total</span>
                <span className="text-2xl font-semibold">{`${dataHistory.total}`}</span>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col justify-between md:flex-row">
                <span className="text-label text-base font-light">
                  No. Rekening Virtual :
                </span>
                <div className="flex flex-row items-center justify-between md:gap-5">
                  <span className="text-lg font-bold">{dataHistory.va}</span>
                  <span className="text-blue-primary border-blue-primary rounded-md border p-1">
                    copy
                  </span>
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:justify-between">
                <span className="text-secondary text-[14px]">
                  Total Payment :
                </span>
                <span className="text-blue-primary text-lg font-bold">{` ${dataHistory.total}`}</span>
              </div>
              <p className="text-secondary text-[12px] font-normal">
                Pay this payment bill before it is due, on{" "}
                <span className="text-importan">{dataHistory.date}</span>. If
                the bill has not been paid by the specified time, it will be
                forfeited
              </p>
              <span className="bg-blue-primary block w-full rounded-md p-2.5 text-center text-white md:w-48">
                Cek Pembayaran
              </span>
            </>
          )}
        </div>
      </div>

      {/* if ticked paid
      <div className="border-background flex flex-col rounded-b-2xl border-t-1 bg-white p-5 shadow-md">
        <div className="flex flex-col items-center justify-between gap-5 md:flex-row">
          <div className="flex w-full flex-col items-center gap-5 md:flex-row">
            <span className="text-active w-full rounded-lg bg-[rgba(0,186,136,0.2)] p-2.5 text-center md:w-44">
              Ticker is Active
            </span>
            <span className="text-importan block w-full rounded-lg bg-[rgba(232,44,44,0.2)] p-2.5 text-center md:w-44">
              Not paid
            </span>
          </div>
          <span
            className="text-label block cursor-pointer text-center text-nowrap"
            onClick={() => setToggleExp(!toggleExp)}
          >
            Show Details
          </span>
        </div>
        <div className={`${!toggleExp && "hidden"} mt-5 flex flex-col gap-2.5`}>
          <div className="text-lg font-bold">Ticket Information</div>
          <div className="flex flex-col justify-between md:flex-row">
            <span className="text-label text-base font-light">
              No. Rekening Virtual :
            </span>
            <div className="flex flex-row items-center justify-between md:gap-5">
              <span className="text-lg font-bold">12321328913829724</span>
              <span className="text-blue-primary border-blue-primary rounded-md border p-1">
                copy
              </span>
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:justify-between">
            <span className="text-secondary text-[14px]">Total Payment :</span>
            <span className="text-blue-primary text-lg font-bold">$30</span>
          </div>
          <p className="text-secondary text-[12px] font-normal">
            Pay this payment bill before it is due, on{" "}
            <span className="text-importan">June 23, 2023</span>. If the bill
            has not been paid by the specified time, it will be forfeited
          </p>
          <span className="bg-blue-primary block w-full rounded-md p-2.5 text-center text-white md:w-48">
            Cek Pembayaran
          </span>
        </div>
      </div> */}
    </div>
  );
}

export default CardHistory;