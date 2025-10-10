import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type UserRole = "client" | "coach";

interface Kid {
  id: string;
  name: string;
  age: number;
  paymentStatus: "paid" | "unpaid";
}

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  kids?: Kid[];
}

export const ProfilePage: React.FC<{ user: User }> = ({ user }) => {
  const [activeSection, setActiveSection] = useState<string>("profile");

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  // Simulated update handlers
  const handleUpdateProfile = () => alert("Profile updated!");
  const handleAddKid = () => alert("Kid added/updated!");
  const handleCheckPayments = () => alert("Checking payments...");
  const handleAddTimeSlot = () => alert("Added available time slot!");
  const handleCoachPayments = () => alert("Viewing coach monthly payments...");

  return (
    <div className="flex min-h-screen bg-gradient-green-light">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r p-4 md:p-6 flex flex-col gap-3 md:gap-4 sticky top-16 z-10">
        <h2 className="text-xl font-semibold">Profile Menu</h2>
        <nav className="flex flex-col gap-2">
          <Button
            variant={activeSection === "profile" ? "default" : "outline"}
            className="w-full"
            onClick={() => handleSectionChange("profile")}
          >
            My Profile
          </Button>

          {user.role === "client" && (
            <>
              <Button
                variant={activeSection === "kids" ? "default" : "outline"}
                className="w-full"
                onClick={() => handleSectionChange("kids")}
              >
                My Kids
              </Button>
              <Button
                variant={activeSection === "invoices" ? "default" : "outline"}
                className="w-full"
                onClick={() => handleSectionChange("invoices")}
              >
                Payment Invoices
              </Button>
            </>
          )}

          {user.role === "coach" && (
            <>
              <Button
                variant={activeSection === "timeslots" ? "default" : "outline"}
                className="w-full"
                onClick={() => handleSectionChange("timeslots")}
              >
                Available Time Slots
              </Button>
              <Button
                variant={activeSection === "coachpayments" ? "default" : "outline"}
                className="w-full"
                onClick={() => handleSectionChange("coachpayments")}
              >
                Monthly Payments
              </Button>
            </>
          )}
        </nav>
      </aside>

      {/* Content Area */}
      <main className="flex-1 p-4 sm:p-6 space-y-4 sm:space-y-6">
        {activeSection === "profile" && (
          <Card>
            <CardHeader>
              <CardTitle>Update Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <Button className="w-full sm:w-auto" onClick={handleUpdateProfile}>Update Profile Info</Button>
            </CardContent>
          </Card>
        )}

        {user.role === "client" && activeSection === "kids" && (
          <Card>
            <CardHeader>
              <CardTitle>My Kids</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.kids?.map((kid) => (
                <div key={kid.id} className="p-4 border rounded-lg">
                  <p><strong>Name:</strong> {kid.name}</p>
                  <p><strong>Age:</strong> {kid.age}</p>
                  <Button className="w-full sm:w-auto mt-2" onClick={handleAddKid}>Edit Kid Details</Button>
                </div>
              ))}
              <Button className="w-full sm:w-auto" onClick={handleAddKid}>+ Add New Kid</Button>
            </CardContent>
          </Card>
        )}

        {user.role === "client" && activeSection === "invoices" && (
          <Card>
            <CardHeader>
              <CardTitle>Payment Invoices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {user.kids?.map((kid) => (
                <div key={kid.id} className="flex justify-between border-b pb-2 text-sm sm:text-base">
                  <span>{kid.name}</span>
                  <span
                    className={`${
                      kid.paymentStatus === "paid" ? "text-green-600" : "text-red-500"
                    } font-medium`}
                  >
                    {kid.paymentStatus === "paid" ? "Paid" : "Pending"}
                  </span>
                </div>
              ))}
              <Button className="w-full sm:w-auto" onClick={handleCheckPayments}>Check All Payments</Button>
            </CardContent>
          </Card>
        )}

        {user.role === "coach" && activeSection === "timeslots" && (
          <Card>
            <CardHeader>
              <CardTitle>Available Time Slots</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-2">Add or update your available times for sessions.</p>
              <Button className="w-full sm:w-auto" onClick={handleAddTimeSlot}>+ Add Time Slot</Button>
            </CardContent>
          </Card>
        )}

        {user.role === "coach" && activeSection === "coachpayments" && (
          <Card>
            <CardHeader>
              <CardTitle>Monthly Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Track your received and pending payments for this month.</p>
              <Button className="w-full sm:w-auto mt-2" onClick={handleCoachPayments}>View Payments</Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};
