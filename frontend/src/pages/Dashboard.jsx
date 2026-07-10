import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfileDetails from "./ProfileDetails";

const PLATFORMS = [
    { id: "GitHub", name: "GitHub", icon: "fa-brands fa-github", color: "#1A1A1A" },
    { id: "Frontend Mentor", name: "Frontend Mentor", icon: "fa-solid fa-code", color: "#FFFFFF", textColor: "#333333", border: "1px solid #D9D9D9" },
    { id: "Twitter", name: "Twitter", icon: "fa-brands fa-twitter", color: "#43B7E9" },
    { id: "LinkedIn", name: "LinkedIn", icon: "fa-brands fa-linkedin", color: "#2D68FF" },
    { id: "YouTube", name: "YouTube", icon: "fa-brands fa-youtube", color: "#EE3939" },
    { id: "Facebook", name: "Facebook", icon: "fa-brands fa-facebook", color: "#2442AC" },
    { id: "Twitch", name: "Twitch", icon: "fa-brands fa-twitch", color: "#9146FF" },
    { id: "Dev.to", name: "Dev.to", icon: "fa-brands fa-dev", color: "#333333" },
    { id: "Codewars", name: "Codewars", icon: "fa-solid fa-fire-flame-curved", color: "#8A1A50" },
    { id: "Codepen", name: "Codepen", icon: "fa-brands fa-codepen", color: "#000000" },
    { id: "freeCodeCamp", name: "freeCodeCamp", icon: "fa-brands fa-freecodecamp", color: "#302040" },
    { id: "GitLab", name: "GitLab", icon: "fa-brands fa-gitlab", color: "#E24329" },
    { id: "Hashnode", name: "Hashnode", icon: "fa-brands fa-hashnode", color: "#2962FF" },
    { id: "Stack Overflow", name: "Stack Overflow", icon: "fa-brands fa-stack-overflow", color: "#F48024" }
];

export default function Dashboard() {
    const navigate = useNavigate();
    const getToken = () => localStorage.getItem("token");
    const [activeTab, setActiveTab] = useState("links");
    const [hover, setHover] = useState(null);

    const [links, setLinks] = useState([]);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [showSelector, setShowSelector] = useState(false);

    const [profile, setProfile] = useState({
        firstName: "",
        lastName: "",
        email: "",
        avatarUrl: null
    });

    const [profileErrors, setProfileErrors] = useState({
        firstName: false,
        lastName: false
    });

    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        const fetchLinks = async () => {
            try {
                const token = getToken();

                if (!token) {
                    console.warn("No token found, falling back to local storage.");
                    loadFromLocalStorage();
                    return;
                }

                const res = await fetch("/api/links",  {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    console.error("Server error:", res.status);
                    loadFromLocalStorage();
                    return;
                }

                const data = await res.json();
                console.log("LINKS FROM BACKEND:", data);

                const backendLinks = Array.isArray(data) ? data : data.links || [];


                if (backendLinks.length === 0) {
                    loadFromLocalStorage();
                } else {
                    setLinks(backendLinks);
                }
            } catch (err) {
                console.error("Error loading links from backend:", err);
                loadFromLocalStorage();
            }
        };

        const loadFromLocalStorage = () => {
            const savedLinks = localStorage.getItem("devlinks");
            if (savedLinks) {
                setLinks(JSON.parse(savedLinks));
            }
        };


        const savedProfile = localStorage.getItem("devprofile");
        if (savedProfile) {
            setProfile(JSON.parse(savedProfile));
        }

        fetchLinks();
    }, []);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfile(prev => ({ ...prev, avatarUrl: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProfileChange = (key, value) => {
        setProfile(prev => ({ ...prev, [key]: value }));
        if (key === "firstName" || key === "lastName") {
            setProfileErrors(prev => ({ ...prev, [key]: value.trim() === "" }));
        }
    };

    const selectAndAddLink = async (platformId) => {
        try {
            const token = getToken();

            const res = await fetch("/api/links",  {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: platformId,
                    url: "",
                }),
            });

            const newLink = await res.json();


            const stableLink = {
                ...newLink,
                title: newLink.title || platformId
            };

            setLinks(prev => [...prev, stableLink]);
            setShowSelector(false);

        } catch (err) {
            console.error(err);
        }
    };

    const updateLink = (index, key, value) => {
        setLinks((prev) => {
            const updated = [...prev];
            if (!updated[index]) return prev;
            updated[index] = { ...updated[index], [key]: value };
            return updated;
        });
    };

    const deleteLink = async (index) => {
        try {
            const token = getToken();
            const linkId = links[index]._id;

           await fetch(`/api/links/${linkId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setLinks(prev => prev.filter((_, i) => i !== index));

        } catch (err) {
            console.error(err);
        }
    };

    const validateForm = () => {
        if (activeTab === "links") {
            let hasError = false;
            const validatedLinks = links.map((link) => {
                if (!link.url || link.url.trim() === "") {
                    hasError = true;
                    return { ...link, error: true };
                }
                return { ...link, error: false };
            });

            if (hasError) {
                setLinks(validatedLinks);
                return false;
            }
            return true;
        } else {
            const errors = {
                firstName: profile.firstName.trim() === "",
                lastName: profile.lastName.trim() === ""
            };
            setProfileErrors(errors);
            return !errors.firstName && !errors.lastName;
        }
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        localStorage.setItem("devlinks", JSON.stringify(links));
        localStorage.setItem("devprofile", JSON.stringify(profile));

        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handlePreviewClick = () => {
        if (!validateForm()) return;

        localStorage.setItem("devlinks", JSON.stringify(links));
        localStorage.setItem("devprofile", JSON.stringify(profile));

        navigate("/preview");
    };

    return (
        <div style={styles.page}>
            <style>{`
              .custom-input-focus:focus {
                border-color: #633CFF !important;
                outline: none !important;
                box-shadow: 0 0 8px rgba(99, 60, 255, 0.25) !important;
              }

              .input-error-style {
                border-color: #FF3939 !important;
              }

              .input-error-style:focus {
                border-color: #FF3939 !important;
                box-shadow: 0 0 8px rgba(255, 57, 57, 0.25) !important;
              }

              .add-new-link-btn:hover {
                background-color: #EFEBFF !important;
              }

              .dropdown-item-hover:hover {
                color: #633CFF !important;
                background-color: #FAFAFA;
              }

              .save-button-style {
                background-color: #633CFF !important;
                color: #FFFFFF !important;
                cursor: pointer !important;
              }

              .save-button-style:hover {
                background-color: #BEADFF !important;
              }

              .upload-overlay:hover .overlay-text {
                opacity: 1 !important;
              }

              @media (max-width: 1024px) {
                .dashboard-main {
                  flex-direction: column !important;
                  height: auto !important;
                }

                .dashboard-left {
                  width: 100% !important;
                  flex: none !important;
                  display: flex !important;
                  justify-content: center !important;
                }

                .dashboard-right {
                  width: 100% !important;
                  min-width: 100% !important;
                }
              }
            `}</style>

            <header style={styles.header}>
                <div style={styles.logo}>
                    <div style={{ ...styles.logoBox, width: "32px", height: "32px", borderRadius: "8px" }}>
                        <i className="fa-solid fa-link" style={{ color: "#FFFFFF", fontSize: "16px" }}></i>
                    </div>
                    <span style={{ ...styles.brand, fontSize: "24px", lineHeight: "24px" }}>devlinks</span>
                </div>

                <div style={styles.tabs}>
                    <button
                        style={activeTab === "links" ? styles.tabActive : { ...styles.tab, color: hover === "links" ? "#633CFF" : "#737373" }}
                        onMouseEnter={() => setHover("links")}
                        onMouseLeave={() => setHover(null)}
                        onClick={() => setActiveTab("links")}
                    >
                        <i className="fa-solid fa-link" style={{ marginRight: "8px" }}></i>
                        Links
                    </button>

                    <button
                        style={activeTab === "profile" ? styles.tabActive : { ...styles.tab, color: hover === "profile" ? "#633CFF" : "#737373" }}
                        onMouseEnter={() => setHover("profile")}
                        onMouseLeave={() => setHover(null)}
                        onClick={() => setActiveTab("profile")}
                    >
                        <i className="fa-regular fa-circle-user" style={{ marginRight: "8px" }}></i>
                        Profile Details
                    </button>
                </div>

                <button
                    style={{
                        ...styles.previewBtn,
                        backgroundColor: hover === "preview" ? "#EFEBFF" : "transparent",
                    }}
                    onMouseEnter={() => setHover("preview")}
                    onMouseLeave={() => setHover(null)}
                    onClick={handlePreviewClick}
                >
                    Preview
                </button>
            </header>

            <div style={styles.main}>
                <div style={styles.left}>
                    <div style={styles.phoneFrame}>
                        <div style={styles.notch}></div>
                        <div style={styles.phoneContent}>
                            <div style={{
                                ...styles.avatar,
                                backgroundImage: profile.avatarUrl ? `url(${profile.avatarUrl})` : "none",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                border: profile.avatarUrl ? "4px solid #633CFF" : "none"
                            }}></div>

                            {profile.firstName || profile.lastName ? (
                                <div style={styles.liveNameText}>
                                    {profile.firstName} {profile.lastName}
                                </div>
                            ) : (
                                <div style={styles.namePlaceHolder}></div>
                            )}

                            {profile.email ? (
                                <div style={styles.liveEmailText}>{profile.email}</div>
                            ) : (
                                <div style={styles.emailPlaceHolder}></div>
                            )}

                            <div style={styles.linksContainer}>
                                {Array.from({ length: 5 }).map((_, i) => {
                                    const activeLink = links[i];
                                    if (!activeLink) {
                                        return (
                                            <div
                                                key={i}
                                                style={{
                                                    ...styles.linkMockSkeleton,
                                                    height: "44px",
                                                    width: "100%",
                                                    backgroundColor: "#EEEEEE",
                                                    borderRadius: "8px",
                                                    display: "block",
                                                    marginBottom: "12px",
                                                    flexShrink: 0
                                                }}
                                            ></div>
                                        );
                                    }

                                    const linkTitle = activeLink.title || activeLink.platform;
                                    const pData = PLATFORMS.find(p => p.id === linkTitle) || PLATFORMS[0];
                                    return (
                                        <div
                                            key={i}
                                            style={{
                                                ...styles.linkMockSkeleton,
                                                height: "44px",
                                                width: "100%",
                                                borderRadius: "8px",
                                                backgroundColor: pData.color,
                                                border: pData.border || "none",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                padding: "0 12px",
                                                marginBottom: "12px",
                                                boxSizing: "border-box",
                                                flexShrink: 0
                                            }}
                                        >
                                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                                <i className={pData.icon} style={{ color: pData.textColor || "#FFF", fontSize: "12px" }}></i>
                                                <span style={{ color: pData.textColor || "#FFF", fontSize: "11px", fontWeight: 500 }}>
                                                    {pData.name}
                                                </span>
                                            </div>
                                            <i className="fa-solid fa-arrow-right" style={{ color: pData.textColor || "#FFF", fontSize: "11px" }}></i>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                <div style={styles.rightColumnWrapper}>
                    {activeTab === "links" ? (
                        <div style={styles.card}>
                            <h1 style={styles.title}>Customize your links</h1>
                            <p style={styles.subtitle}>
                                Add/edit/remove links below and then share all your profiles with the world!
                            </p>

                            <div style={{ position: "relative", marginBottom: "20px" }}>
                                <button
                                    className="add-new-link-btn"
                                    style={{ ...styles.addBtn, transition: "background-color 0.2s" }}
                                    onClick={() => setShowSelector(!showSelector)}
                                >
                                    + Add new link
                                </button>

                                {showSelector && (
                                    <div style={styles.mainSelectorDropdown}>
                                        <div style={{ padding: "8px 12px", fontSize: "12px", color: "#737373", borderBottom: "1px solid #F5F5F5" }}>
                                            Select a platform to add:
                                        </div>
                                        {PLATFORMS.map((p) => (
                                            <div
                                                key={p.id}
                                                className="dropdown-item-hover"
                                                style={styles.dropdownOptionItem}
                                                onClick={() => selectAndAddLink(p.id)}
                                            >
                                                <i className={p.icon} style={{ width: "20px" }}></i>
                                                {p.name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {links.map((link, index) => {
                                // ფიქსი: აქაც ვამოწმებთ link.title-სა და link.platform-ს
                                const currentPlatformKey = link.title || link.platform;
                                const selectedPlatform = PLATFORMS.find(p => p.id === currentPlatformKey) || PLATFORMS[0];

                                return (
                                    <div key={index} style={styles.linkCardItem}>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                                <i className="fa-solid fa-bars" style={{ color: "#737373" }}></i>
                                                <strong>Link #{index + 1}</strong>
                                            </div>
                                            <button onClick={() => deleteLink(index)} style={styles.removeBtn}>Remove</button>
                                        </div>

                                        <div style={{ position: "relative", marginBottom: "8px" }}>
                                            <div
                                                style={styles.innerSelectBox}
                                                onClick={() => setActiveDropdown(activeDropdown === index ? null : index)}
                                            >
                                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                    <i className={selectedPlatform.icon} style={{ color: "#737373" }}></i>
                                                    <span>{selectedPlatform.name}</span>
                                                </div>
                                                <i className="fa-solid fa-chevron-down" style={{ fontSize: "12px", color: "#737373" }}></i>
                                            </div>

                                            {activeDropdown === index && (
                                                <div style={styles.dropdownOptionsList}>
                                                    {PLATFORMS.map((p) => (
                                                        <div
                                                            key={p.id}
                                                            className="dropdown-item-hover"
                                                            style={styles.dropdownOptionItem}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                updateLink(index, "title", p.id); // ფიქსი: ყოველთვის ვანახლებთ "title"-ს
                                                                setActiveDropdown(null);
                                                            }}
                                                        >
                                                            <i className={p.icon} style={{ width: "20px" }}></i>
                                                            {p.name}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                                            <i className="fa-solid fa-link" style={{ position: "absolute", left: "10px", color: link.error ? "#FF3939" : "#737373", fontSize: "14px", zIndex: 10 }}></i>
                                            <input
                                                className={`custom-input-focus ${link.error ? "input-error-style" : ""}`}
                                                placeholder="e.g. https://github.com/johnsmith"
                                                value={link.url || ""}
                                                onChange={(e) => updateLink(index, "url", e.target.value)}
                                                style={{
                                                    width: "100%",
                                                    padding: link.error ? "8px 110px 8px 32px" : "8px 8px 8px 32px",
                                                    border: "1px solid #D9D9D9",
                                                    borderRadius: "6px",
                                                    boxSizing: "border-box",
                                                    transition: "all 0.2s"
                                                }}
                                            />
                                            {link.error && <span style={styles.inputErrorText}>Can't be empty</span>}
                                        </div>
                                    </div>
                                );
                            })}

                            {links.length === 0 && (
                                <div style={styles.emptyCanvas}>
                                    <i className="fa-solid fa-layer-group" style={styles.emptyIcon}></i>
                                    <h2 style={styles.emptyTitle}>Let’s get you started</h2>
                                    <p style={styles.emptyText}>
                                        Use the “Add new link” button to get started. Once you have more than one link, you can reorder and edit them.
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <ProfileDetails
                            profile={profile}
                            profileErrors={profileErrors}
                            onProfileChange={handleProfileChange}
                            onImageUpload={handleImageUpload}
                            styles={styles}
                        />
                    )}

                    <footer style={styles.footer}>
                        <button
                            className="save-button-style"
                            style={styles.saveBtnAction}
                            onClick={handleSave}
                        >
                            Save
                        </button>
                    </footer>
                </div>
            </div>

            {showToast && (
                <div style={styles.toastNotification}>
                    <i className="fa-solid fa-floppy-disk" style={{ marginRight: "10px" }}></i>
                    Your changes have been successfully saved!
                </div>
            )}
        </div>
    );
}

const styles = {
    page: {
        height: "100vh",
        maxHeight: "100vh",
        backgroundColor: "#FAFAFA",
        padding: "20px",
        fontFamily: "Instrument Sans",
        boxSizing: "border-box",
        overflow: "hidden",
        position: "relative"
    },
    header: {
        backgroundColor: "#FFFFFF",
        borderRadius: "12px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.03)",
        padding: "12px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center", height: "56px",
        boxSizing: "border-box",
        marginBottom: "16px"
    },
    logo: {
        display: "flex",
        alignItems: "center",
        gap: "8px"
    },
    logoBox: {
        backgroundColor: "#633CFF",
        display: "flex", alignItems: "center",
        justifyContent: "center"
    },
    brand: {
        fontWeight: 800,
        color: "#333333",
        letterSpacing: "-0.5px"
    },
    tabs: {
        display: "flex",
        gap: "8px", alignItems: "center"
    },
    tabActive: {
        backgroundColor: "#EFEBFF",
        color: "#633CFF",
        border: "none",
        padding: "8px 20px",
        borderRadius: "8px",
        fontWeight: 600,
        fontSize: "15px",
        display: "inline-flex",
        alignItems: "center",
        cursor: "pointer"
    },
    tab: {
        backgroundColor: "transparent",
        border: "none", color: "#737373",
        fontWeight: 600, fontSize: "15px",
        padding: "8px 20px",
        display: "inline-flex",
        alignItems: "center",
        cursor: "pointer"
    },
    previewBtn: {
        border: "1px solid #633CFF",
        backgroundColor: "transparent",
        color: "#633CFF",
        padding: "8px 20px",
        borderRadius: "8px",
        fontWeight: 600,
        fontSize: "15px",
        cursor: "pointer"
    },
    main: {
        display: "flex",
        gap: "16px",
        alignItems: "stretch",
        width: "100%",
        height: "calc(100vh - 112px)",
        flexDirection: "row",
        flexWrap: "wrap"
    },
    left: {
        width: "480px",
        maxWidth: "100%",
        flex: "0 0 480px",
        backgroundColor: "#FFFFFF",
        borderRadius: "12px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        boxSizing: "border-box",
        height: "100%"
    },
    phoneFrame: {
        width: "280px",
        maxWidth: "100%",
        transform: "scale(1)",
        height: "92%",
        maxHeight: "560px",
        border: "1px solid #D9D9D9",
        borderRadius: "36px",
        position: "relative",
        padding: "36px 20px 20px 20px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#FFFFFF"
    },
    notch: {
        position: "absolute",
        top: "14px", left: "50%",
        transform: "translateX(-50%)",
        width: "80px",
        height: "5px",
        border: "1px solid #D9D9D9",
        borderRadius: "8px"
    },
    phoneContent: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "8px"
    },
    avatar: {
        width: "84px",
        height: "84px",
        backgroundColor: "#EEEEEE",
        borderRadius: "50%",
        marginBottom: "16px"
    },
    namePlaceHolder: {
        width: "120px",
        height: "14px",
        backgroundColor: "#EEEEEE",
        borderRadius: "8px", marginBottom: "8px"
    },
    emailPlaceHolder: {
        width: "72px",
        height: "8px",
        backgroundColor: "#EEEEEE",
        borderRadius: "4px",
        marginBottom: "36px"
    },
    liveNameText: {
        fontSize: "16px",
        fontWeight: 700,
        color: "#333333",
        marginBottom: "4px",
        textAlign: "center",
        width: "100%",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
    },
    liveEmailText: {
        fontSize: "12px",
        color: "#737373",
        marginBottom: "32px",
        textAlign: "center",
        width: "100%",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
    },
    linksContainer: {
        display: "flex",
        flexDirection: "column",
        gap: "14px", width: "100%",
        alignItems: "center"
    },
    linkMockSkeleton: {
        width: "100%",
        height: "36px", backgroundColor: "#EEEEEE", borderRadius: "6px"
    },
    rightColumnWrapper: {
        flex: "1 1 400px",
        minWidth: "320px",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#FFFFFF",
        borderRadius: "12px",
        overflow: "hidden",
        height: "100%"
    },
    card: {
        padding: "32px",
        boxSizing: "border-box",
        display: "flex", flexDirection: "column", flexGrow: 1, overflowY: "auto"
    },
    title: {
        fontSize: "28px",
        fontWeight: 700,
        color: "#333333",
        margin: "0 0 6px 0",
        lineHeight: "120%"
    },
    subtitle: {
        fontSize: "15px",
        color: "#737373",
        margin: "0 0 24px 0",
        lineHeight: "140%"
    },
    addBtn: {
        width: "100%",
        border: "1px solid #633CFF",
        color: "#633CFF",
        backgroundColor: "transparent",
        padding: "10px 0",
        borderRadius: "8px",
        fontWeight: 600,
        fontSize: "15px",
        cursor: "pointer"
    },
    mainSelectorDropdown: {
        position: "absolute",
        top: "110%",
        left: 0,
        right: 0,
        backgroundColor: "#FFFFFF",
        border: "1px solid #D9D9D9",
        borderRadius: "8px",
        boxShadow: "0px 8px 16px rgba(0,0,0,0.08)",
        zIndex: 100,
        maxHeight: "180px",
        overflowY: "auto"
    },
    linkCardItem: {
        border: "1px solid #D9D9D9",
        borderRadius: "8px",
        padding: "12px",
        marginBottom: "12px",
        background: "#fff"
    },
    removeBtn: {
        background: "none",
        border: "none",
        color: "#737373",
        cursor: "pointer"
    },
    innerSelectBox: {
        width: "100%",
        padding: "8px 12px",
        border: "1px solid #D9D9D9",
        borderRadius: "6px",
        backgroundColor: "#FFF",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        cursor: "pointer",
        boxSizing: "border-box"
    },
    dropdownOptionsList: {
        position: "absolute",
        top: "105%",
        left: 0,
        right: 0,
        backgroundColor: "#FFFFFF",
        border: "1px solid #D9D9D9",
        borderRadius: "6px",
        boxShadow: "0px 4px 12px rgba(0,0,0,0.08)",
        zIndex: 50,
        maxHeight: "150px",
        overflowY: "auto"
    },
    dropdownOptionItem: {
        padding: "8px 12px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        cursor: "pointer",
        fontSize: "14px",
        borderBottom: "1px solid #F9F9F9",
        color: "#737373",
        transition: "all 0.2s"
    },
    inputErrorText: {
        position: "absolute",
        right: "12px",
        top: "50%",
        transform: "translateY(-50%)",
        color: "#FF3939",
        fontSize: "12px",
        pointerEvents: "none"
    },
    emptyCanvas: {
        backgroundColor: "#FAFAFA",
        borderRadius: "12px",
        padding: "40px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        flexGrow: 1
    },
    emptyIcon: {
        fontSize: "40px",
        color: "#633CFF",
        marginBottom: "16px"
    },
    emptyTitle: {
        fontSize: "22px",
        fontWeight: 700,
        color: "#333333",
        margin: "0 0 12px 0"
    },
    emptyText: {
        fontSize: "14px",
        color: "#737373"
    },
    footer: {
        padding: "16px 32px",
        borderTop: "1px solid #D9D9D9",
        display: "flex",
        justifyContent: "flex-end",
        backgroundColor: "#FFF"
    },
    saveBtnAction: {
        padding: "12px 26px",
        borderRadius: "8px",
        border: "none",
        fontWeight: 600,
        fontSize: "15px"
    },
    toastNotification: {
        position: "fixed",
        bottom: "40px",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "#333333",
        color: "#FFFFFF",
        padding: "16px 24px",
        borderRadius: "12px",
        fontSize: "16px",
        display: "flex",
        alignItems: "center",
        boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.15)",
        zIndex: 1000
    }
};