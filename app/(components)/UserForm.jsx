"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

function UserForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    const res = await fetch("/api/Users", {
      method: "POST",
      body: JSON.stringify(formData),
      "content-type": "application/json",
    });

    if (!res.ok) {
      const response = await res.json();
      setErrorMessage(response.message);
    } else {
      router.refresh();
      router.push("/");
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        method="post"
        className="flex flex-col gap-3 w-1/2"
      >
        <h1>Create New User</h1>
        <label htmlFor="">Full Name</label>
        <input
          type="text"
          id="name"
          name="name"
          onChange={handleChange}
          required={true}
          value={formData.name}
          className="m-2 bg-slate-400 rounded"
        />

        <label htmlFor="">Email</label>

        <input
          type="text"
          id="email"
          name="email"
          onChange={handleChange}
          required={true}
          value={formData.email}
          className="m-2 bg-slate-400 rounded"
        />

        <label htmlFor="">Password</label>

        <input
          type="password"
          id="password"
          name="password"
          onChange={handleChange}
          required={true}
          value={formData.password}
          className="m-2 bg-slate-400 rounded"
        />
        <input
          type="submit"
          value={"Create User"}
          className="bg-blue-300 hover:bg-blue-100"
        />
      </form>
      <p className="text-red-500"> {errorMessage} </p>
    </>
  );
}

export default UserForm;
