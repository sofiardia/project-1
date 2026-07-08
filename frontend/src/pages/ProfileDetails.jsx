export default function ProfileDetails({
    profile,
    profileErrors,
    onProfileChange,
    onImageUpload
}) {
    return (
        <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            height: "100%"
        }}>
            
            <div style={{ flex: 1 }}>
            
                <h1 style={{
                    fontSize: "32px",
                    fontWeight: 700,
                    color: "#333333",
                    marginBottom: "8px"
                }}>
                    Profile Details
                </h1>

                <p style={{
                    fontSize: "16px",
                    color: "#737373",
                    marginBottom: "40px"
                }}>
                    Add your details to create a personal touch to your profile.
                </p>

                <div style={{
                    backgroundColor: "#FAFAFA",
                    borderRadius: "12px",
                    padding: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "24px"
                }}>
                    <span style={{ color: "#737373", fontSize: "16px", flex: 1 }}>
                        Profile picture
                    </span>

                    <label style={{
                        width: "140px",
                        height: "140px",
                        borderRadius: "12px",
                        backgroundColor: "#EFEBFF",
                        backgroundImage: profile.avatarUrl ? `url(${profile.avatarUrl})` : "none",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        position: "relative",
                        overflow: "hidden"
                    }}>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={onImageUpload}
                            style={{ display: "none" }}
                        />

                        {profile.avatarUrl && (
                            <div style={{
                                position: "absolute",
                                inset: 0,
                                background: "rgba(0,0,0,0.5)"
                            }} />
                        )}

                        <div style={{
                            zIndex: 2,
                            color: profile.avatarUrl ? "#ffffff" : "#633CFF",
                            textAlign: "center"
                        }}>
                            <i className="fa-regular fa-image" style={{ fontSize: "24px", marginBottom: "8px", display: "block" }} />
                            <div style={{ fontSize: "16px", fontWeight: 600 }}>
                                {profile.avatarUrl ? "Change Image" : "+ Upload Image"}
                            </div>
                        </div>
                    </label>

                    <p style={{
                        flex: 1.5,
                        fontSize: "12px",
                        color: "#737373",
                        marginLeft: "24px",
                        lineHeight: "1.5"
                    }}>
                        Image must be below 1024x1024px.<br />
                        Use PNG or JPG format.
                    </p>
                </div>

                <div style={{
                    backgroundColor: "#FAFAFA",
                    borderRadius: "12px",
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px"
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <label style={{ color: "#333333", fontSize: "16px", flex: 1 }}>First name *</label>
                        <div style={{ position: "relative", flex: 2 }}>
                            <input
                                value={profile.firstName}
                                onChange={(e) => onProfileChange("firstName", e.target.value)}
                                placeholder="e.g. John"
                                style={{
                                    width: "100%",
                                    height: "48px",
                                    padding: "12px 16px",
                                    borderRadius: "8px",
                                    border: profileErrors.firstName ? "1px solid #FF3939" : "1px solid #D9D9D9",
                                    backgroundColor: "#ffffff",
                                    fontSize: "16px",
                                    color: "#333333",
                                    outline: "none",
                                    boxSizing: "border-box"
                                }}
                            />
                            {profileErrors.firstName && (
                                <span style={{
                                    position: "absolute",
                                    right: "16px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    color: "#FF3939",
                                    fontSize: "12px"
                                }}>
                                    Can't be empty
                                </span>
                            )}
                        </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <label style={{ color: "#333333", fontSize: "16px", flex: 1 }}>Last name *</label>
                        <div style={{ position: "relative", flex: 2 }}>
                            <input
                                value={profile.lastName}
                                onChange={(e) => onProfileChange("lastName", e.target.value)}
                                placeholder="e.g. Wright"
                                style={{
                                    width: "100%",
                                    height: "48px",
                                    padding: "12px 16px",
                                    borderRadius: "8px",
                                    border: profileErrors.lastName ? "1px solid #FF3939" : "1px solid #D9D9D9",
                                    backgroundColor: "#ffffff",
                                    fontSize: "16px",
                                    color: "#333333",
                                    outline: "none",
                                    boxSizing: "border-box"
                                }}
                            />
                            {profileErrors.lastName && (
                                <span style={{
                                    position: "absolute",
                                    right: "16px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    color: "#FF3939",
                                    fontSize: "12px"
                                }}>
                                    Can't be empty
                                </span>
                            )}
                        </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <label style={{ color: "#333333", fontSize: "16px", flex: 1 }}>Email</label>
                        <div style={{ position: "relative", flex: 2 }}>
                            <input
                                value={profile.email}
                                onChange={(e) => onProfileChange("email", e.target.value)}
                                placeholder="e.g. alex@email.com"
                                style={{
                                    width: "100%",
                                    height: "48px",
                                    padding: "12px 16px",
                                    borderRadius: "8px",
                                    border: "1px solid #D9D9D9",
                                    backgroundColor: "#ffffff",
                                    fontSize: "16px",
                                    color: "#333333",
                                    outline: "none",
                                    boxSizing: "border-box"
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}