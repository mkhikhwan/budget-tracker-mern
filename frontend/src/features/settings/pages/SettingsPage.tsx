import { useState, useEffect, useCallback } from "react";
import PageLayout from "../../../shared/layouts/PageLayout";
import CountrySelect from "../../../shared/components/form/CountrySelect";
import * as SettingsAPI from "../Settings.api"
import * as SettingsMapper from "../Settings.mapper"
import { type UserSettings } from "../Settings.types";

function SettingsPage() {
    const [country, setCountry] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchSettings = useCallback(async () => {
        try {
            const res = await SettingsAPI.getSettings();
            const data = SettingsMapper.mapSettingsToUI(res);
            setCountry(data.country);
        } catch (error) {
            console.error("Failed to load settings", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    const onConfirm = async () => {
        try {
            const payload:UserSettings = {
                country: country
            }
            await SettingsAPI.updateSettings( SettingsMapper.mapSettingsToPayload(payload) );
            alert("Settings updated successfully");
        } catch (error) {
            alert(error instanceof Error ? error.message : "Failed to update settings");
        }
    };

    if (loading) return <PageLayout header="Settings"><div>Loading...</div></PageLayout>;

    return (
        <PageLayout header="Settings">
            <p>Country: </p>
            <CountrySelect country={country} setCountry={setCountry} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button onClick={onConfirm} className="bg-primary" style={{ padding: '0.5rem 1rem', cursor: 'pointer', borderRadius: '8px', fontWeight: 600 }}>
                    Confirm
                </button>
            </div>
        </PageLayout>
    );
}

export default SettingsPage;