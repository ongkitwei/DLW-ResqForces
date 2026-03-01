import Form from "@/ui/Form";
import React from "react";

function AddDutyForm() {
  return (
    <div className="w-full max-w-[95%] mx-auto lg:max-w-[80%] h-fit bg-base-100 shadow-lg rounded-2xl p-5 lg:p-12 mt-4">
      <Form title="CREATE DUTY LIST" buttonName="ADD DUTY" />
    </div>
  );
}

export default AddDutyForm;
