import { getSystemSettings } from "./actions";
import SettingsForm from "./SettingsForm";

export default async function AdminSettingsPage() {
  const settings = await getSystemSettings();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Platform Settings</h1>
        <p className="text-base-content/60 mt-1">Configure global application parameters</p>
      </div>

      <SettingsForm initialSettings={settings} />
    </div>
  );
}
