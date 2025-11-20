import React from "react";

const Header = ({ title = "Màn hình quản lý task cá nhân" }) => {
  return (
    <div className="text-center">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900">
        {title}
      </h1>
      <p className="mt-3 text-slate-600">
        Quản lý các công việc và theo dõi tiến độ
      </p>
    </div>
  );
};

export default Header;
