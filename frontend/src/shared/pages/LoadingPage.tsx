import Loading from "../../assets/3-dots-bounce.svg?react";

function LoadingPage() {
    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            flexDirection: "column"
        }}>
            <Loading width={32} height={32} fill="#707094" />
        </div>
    );
}

export default LoadingPage;