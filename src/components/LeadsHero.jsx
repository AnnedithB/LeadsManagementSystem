import LeadsInputForm from "./LeadsInputForm";
import LeadsDisplayTable from "./LeadsDisplayTable";

// leads hero function esentially combines both the leads form component and the leads table component while applying flex design to it
// done to keep app.jsx clean and easy to read incase further functonality is added to the app
export default function LeadsHero() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      <div className="w-full flex flex-col min-h-screen bg-gradient-to-br from-[#e9316c] to-[#f05e53] p-2 md:p-8 flex items-center justify-center">
        <h1 className="text-5xl text-white text-center my-12">
          Leads Management System
        </h1>
        <div className="flex flex-col md:flex-row justify-between mt-5 bg-white p-5 rounded-lg mx-auto align-center w-[100%] md:w-[90%]">
          <div className="w-full md:w-1/2 mr-5 border border-gray-300 rounded-lg p-5 mb-5 md:mb-0">
            <LeadsInputForm />
          </div>
          <div className="w-full md:w-1/2   border border-gray-300 rounded-lg p-5">
            <LeadsDisplayTable />
          </div>
        </div>
      </div>
    </div>
  );
}
