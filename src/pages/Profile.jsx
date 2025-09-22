import { useState, useEffect } from "react";
import CardHistory from "../components/ProfileHistory.jsx";
import { apiFetch } from "../utils/apiFetch.js";

function Profile() {
  const [toggleModal, setToggleModal] = useState(false);
  const [isDetailOrHistory, setDetailOrHistory] = useState(true);
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);

  // state untuk password lama dan baru
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [avatarFile, setAvatarFile] = useState(null);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  const isButtonDisabled = !oldPassword || !newPassword;

  /** Fetch profile & history */
 useEffect(() => {
   apiFetch("/user/profile")
     .then((data) => {
       if (!data) return; // sudah redirect jika 401
       setProfile(data);
       setHistory(data.history || []);
       setForm({
         first_name: data.first_name || "",
         last_name: data.last_name || "",
         email: data.email || "",
         phone: data.phone || "",
       });
     })
     .catch((err) => console.error("Fetch profile error:", err));
 }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /** Update profile via FormData */
 const handleUpdate = async () => {
   try {
     const formData = new FormData();
     formData.append("first_name", form.first_name);
     formData.append("last_name", form.last_name);
     formData.append("phone", form.phone);
     if (avatarFile) formData.append("avatar", avatarFile);

     const updated = await apiFetch("/user/profile", {
       method: "PATCH",
       body: formData,
     });
     if (!updated) return;
     setProfile(updated);
     setToggleModal(false);
   } catch (err) {
     console.error(err);
     alert("Gagal memperbarui profil");
   }
 };

  /** Update password */
  const handleUpdatePassword = async () => {
    if (isButtonDisabled) return;
    try {
      await apiFetch("/user/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_password: oldPassword,
          new_password: newPassword,
        }),
      });
      alert("Password berhasil diperbarui");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      console.error(err);
      alert("Gagal memperbarui password");
    }
  };

  if (!profile) {
    return (
      <main className="bg-background w-full justify-self-center md:px-20">
        <div className="animate-pulse h-max items-start md:flex md:flex-row md:p-5">
          <div className="w-96 h-96 bg-gray-300 rounded-xl"></div>
          <div className="flex-1 space-y-4 ml-6">
            <div className="h-8 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const avatarFullUrl = profile.avatar_url?.startsWith("http")
    ? profile.avatar_url
    : `http://localhost:8080${profile.avatar_url || ""}`;

  return (
    <main className="bg-background w-full justify-self-center md:px-20">
      <div className="flex w-full flex-row justify-around bg-white shadow-md md:hidden">
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

      <main className="h-max items-start md:flex md:flex-row md:p-5">
        <aside
          className={`${
            !isDetailOrHistory && "hidden"
          } flex flex-col items-center px-4 py-8 md:block md:w-96 md:px-0`}
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
              <div className="relative">
                <img
                  className="h-[136px] w-[136px] rounded-full object-cover shadow-md"
                  src={avatarFullUrl || "/profile_default.jpg"}
                  alt="profile_page"
                  onError={(e) => {
                    e.currentTarget.src = "/profile_default.jpg";
                  }}
                />
              </div>
              <span className="text-xl font-semibold text-[#14142B]">
                {`${profile.first_name} ${profile.last_name}`}
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
                {profile.points || 120}
                <span className="text-[10px]">points</span>
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

        <div
          className={`${
            !toggleModal && "hidden"
          } fixed inset-0 bg-[rgb(0,0,0,0.8)] z-40`}
          onClick={() => setToggleModal(!toggleModal)}
        ></div>

        <section
          className={`flex flex-col justify-center gap-6 p-8 md:m-[28px] md:w-full md:gap-5 md:p-0`}
        >
          <div className="hidden md:mb-5 md:flex md:h-max md:w-full md:flex-row md:rounded-xl md:bg-white md:pl-4 md:shadow-md">
            <span
              className={`${
                isDetailOrHistory && "border-blue-primary border-b-2 text-black"
              } block p-4 text-[#AAAAAA] cursor-pointer`}
              onClick={() => setDetailOrHistory(true)}
            >
              Details Account
            </span>
            <span
              className={`${
                !isDetailOrHistory &&
                "border-blue-primary border-b-2 text-black"
              } block p-4 text-[#AAAAAA] cursor-pointer`}
              onClick={() => setDetailOrHistory(false)}
            >
              Order History
            </span>
          </div>

          <section
            className={`${!isDetailOrHistory && "hidden md:hidden"} ${
              toggleModal
                ? "absolute top-[120px] left-1/2 -translate-x-1/2 transform z-50"
                : ""
            } md:static md:flex md:translate-none md:transform-none md:flex-col md:gap-5 md:bg-[rgb(0,0,0,0)]`}
          >
            <div
              className={`${
                !toggleModal && "hidden"
              } w-2xs rounded-xl bg-white p-4 md:flex md:w-full md:flex-col md:gap-5 md:bg-[rgb(0,0,0,0)] md:p-0`}
            >
              <span className="text-2xl font-bold md:hidden">
                Account Settings
              </span>
              {/* Form Update Profile */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdate();
                }}
                className="flex flex-col gap-5 bg-white md:rounded-xl md:p-5 md:shadow-md"
              >
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
                      name="first_name"
                      type="text"
                      value={form.first_name}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="text-base text-[#4E4B66]">
                      Last Name
                    </label>
                    <input
                      className="w-full rounded-md border border-gray-300 p-2"
                      name="last_name"
                      type="text"
                      value={form.last_name}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="text-base text-[#4E4B66]">Email</label>
                    <input
                      className="w-full cursor-not-allowed rounded-md border border-gray-300 bg-gray-100 p-2 text-gray-500"
                      type="text"
                      value={form.email}
                      disabled
                    />
                  </div>
                  <div>
                    <label className="text-base text-[#4E4B66]">
                      Phone Number
                    </label>
                    <input
                      className="w-full rounded-md border border-gray-300 p-2"
                      name="phone"
                      type="text"
                      value={form.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="mb-5 block w-full cursor-pointer rounded-lg bg-blue-800 p-4 text-center text-white md:w-80"
                >
                  Update Change
                </button>
              </form>

              {/* Form Update Password */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdatePassword();
                }}
                className="flex flex-col gap-5 bg-white md:rounded-xl md:p-5 md:shadow-md"
              >
                <span className="block w-full border-b border-gray-300 p-1">
                  Account and Privacy
                </span>
                <div className="md:flex md:w-full md:flex-row md:gap-5">
                  <div className="mb-4 md:mb-0">
                    <label className="text-base text-[#4E4B66]">
                      Old Password
                    </label>
                    <input
                      className="w-full rounded-md border border-gray-300 p-2"
                      type="password"
                      placeholder="Old password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-base text-[#4E4B66]">
                      New Password
                    </label>
                    <input
                      className="w-full rounded-md border border-gray-300 p-2"
                      type="password"
                      placeholder="New password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className={`${
                    isButtonDisabled
                      ? "cursor-not-allowed bg-gray-400"
                      : "bg-blue-800"
                  } mb-5 block w-full rounded-lg p-4 text-center text-white md:w-80`}
                  disabled={isButtonDisabled}
                >
                  Update password
                </button>
              </form>
            </div>
          </section>

          {/* Order History */}
          <section
            className={`${
              isDetailOrHistory && "hidden md:hidden"
            } flex flex-col gap-7 md:w-full md:bg-[rgb(0,0,0,0)] md:p-0`}
          >
            {history.length > 0 ? (
              history.map((h) => (
                <CardHistory
                  key={h.order_id}
                  dataHistory={{
                    movie_title: h.movie_title,
                    date: h.date,
                    total: h.total_price,
                    status: h.status,
                  }}
                />
              ))
            ) : (
              <div className="bg-white rounded-xl p-8 shadow-md text-center">
                <p className="text-[#4E4B66] text-base">
                  No order history found.
                </p>
              </div>
            )}
          </section>
        </section>
      </main>
    </main>
  );
}

export default Profile;
