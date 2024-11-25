"use client";

import Header from "@/components/shared/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Employee } from "@/types/user";
import React from "react";
import {
  AccountSettingCard,
  AccountSettingCardDialog,
  AccountSettingContent,
} from "./components/AccountSettingCard";
import AccountSettingEmailDialog from "./components/AccountSettingEmailDialog";
import { AccountSettingProfileDialog } from "./components/AccountSettingProfileDialog";
import AccountSettingsPasswordDialog from "./components/AccountSettingsPasswordDialog";

type AccountSettingCardItem = {
  title: string;
  description: string;
  dialog: React.ReactNode;
};

const AccountClient = ({ employee }: { employee: Employee }) => {
  const accountPreferencesCards: AccountSettingCardItem[] = [
    {
      title: "Change Email Address",
      description: employee.user.email,
      dialog: <AccountSettingEmailDialog user={employee.user} />,
    },
    {
      title: "Change Profile Details",
      description: "Change your details such as profile image and full name.",
      dialog: <AccountSettingProfileDialog employee={employee} />,
    },
  ];

  const accountAuthenticationCards: AccountSettingCardItem[] = [
    {
      title: "Change Password",
      description: "Change your account password.",
      dialog: <AccountSettingsPasswordDialog />,
    },
  ];

  return (
    <React.Fragment>
      <Header overrideHeaderTitle="Account Settings">{""}</Header>
      <main className="main-container">
        <Tabs defaultValue="preferences" className="space-y-4">
          <TabsList>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="authentication">Authentication</TabsTrigger>
          </TabsList>
          <TabsContent value="preferences">
            <div className="flex flex-col gap-4">
              {accountPreferencesCards.map((setting) => (
                <AccountSettingCard>
                  <AccountSettingContent>
                    <h3 className="text-xl font-semibold">{setting.title}</h3>
                    <p>{setting.description}</p>
                  </AccountSettingContent>
                  <AccountSettingCardDialog>
                    {setting.dialog}
                  </AccountSettingCardDialog>
                </AccountSettingCard>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="authentication">
            <div className="flex flex-col gap-4">
              {accountAuthenticationCards.map((setting) => (
                <AccountSettingCard>
                  <AccountSettingContent>
                    <h3 className="text-xl font-semibold">{setting.title}</h3>
                    <p>{setting.description}</p>
                  </AccountSettingContent>
                  <AccountSettingCardDialog>
                    {setting.dialog}
                  </AccountSettingCardDialog>
                </AccountSettingCard>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </React.Fragment>
  );
};

export default AccountClient;
