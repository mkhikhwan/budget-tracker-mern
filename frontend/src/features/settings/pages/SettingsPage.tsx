import { useState } from "react";
import PageLayout from "../../../shared/layouts/PageLayout";
import CountrySelect from "../../../shared/components/form/CountrySelect";

function SettingsPage() {
    const [country, setCountry] = useState("");

    // TODO: GET /settings

    const onConfirm = () => {
        // TODO: POST /settings
        console.log("settings changed");
    };

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