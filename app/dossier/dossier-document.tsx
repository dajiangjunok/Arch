/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from "react";

import "./dossier.css";

const imageViews: Record<
  string,
  { width: string; height: string; left: string; top: string }
> = {
  "/dossier/blacklake.jpg": {
    width: "154.55%",
    height: "132.62%",
    left: "69.0014%",
    top: "66.3067%",
  },
  "/dossier/alibaba-cloud.jpg": {
    width: "114.72%",
    height: "188.73%",
    left: "57.3587%",
    top: "32.4004%",
  },
  "/dossier/ant-group.jpg": {
    width: "100%",
    height: "482.92%",
    left: "50%",
    top: "162.9657%",
  },
};

function DossierImage({ src, alt, style }: { src: string; alt: string; style: CSSProperties }) {
  const view = imageViews[src];

  if (view) {
    return (
      <span className="dossier-image-frame" style={style}>
        <img
          className="dossier-image dossier-image-cropped"
          src={src}
          alt={alt}
          style={view}
        />
      </span>
    );
  }

  return <img className="dossier-image" src={src} alt={alt} style={style} />;
}

export function DossierDocument() {
  return (
    <article className="dossier-document">
    <header className="dossier-running-header" style={{ display: "flex", alignItems: "center", gap: "14px", paddingBottom: "16px" }}>
      <img src="/dossier/arch-logo.png" alt="The Arch" style={{ height: "34px", width: "auto", display: "block" }} />
      <span style={{ font: "11px 'Space Mono',monospace", letterSpacing: "3px", color: "#8d94a3" }}>SHANGHAI PROGRAM 2026</span>
    </header>
    
    
    
    <section className="dossier-section" data-screen-label="01" style={{ padding: "0 0 54px", display: "flex", flexDirection: "column", fontFamily: "'Noto Sans SC',sans-serif", color: "#16305c" }}>
      <div style={{ marginTop: "26px", background: "#16305c", borderRadius: "22px", padding: "44px 46px 56px", color: "#f7f1e3", position: "relative", overflow: "hidden", width: "590px", height: "354px" }}>
        <span style={{ position: "absolute", top: "-40px", right: "-30px", width: "190px", height: "190px", borderRadius: "50%", background: "rgba(255,255,255,.06)" }}></span>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", position: "relative" }}>
          <img src="/dossier/arch-mark.png" alt="The Arch" style={{ height: "34px", width: "auto", display: "block" }} />
          <span style={{ font: "15px 'Space Mono',monospace", letterSpacing: "4px" }}>THE ARCH</span>
        </div>
        <div style={{ marginTop: "34px", font: "12px 'Space Mono',monospace", letterSpacing: "3px", color: "#e0b04a" }}>SHANGHAI PROGRAM</div>
        <h1 style={{ margin: "14px 0 0", fontFamily: "Spectral,serif", fontWeight: "600", fontSize: "44px", lineHeight: "1.14", letterSpacing: "-.01em", maxWidth: "9.5em", textWrap: "pretty", width: "488px", height: "180px" }}>6 Days + 5 Nights China Innovation Residency in Shanghai</h1>
        <div style={{ marginTop: "22px", font: "12px 'Space Mono',monospace", letterSpacing: "3px", color: "#e0b04a" }}>SHANGHAI, CHINA (6 DAYS, 5 NIGHTS)</div>
        <p style={{ margin: "18px 0 0", fontSize: "13px", lineHeight: "1.6", color: "rgba(247,241,227,.72)", maxWidth: "34em" }}>Company visits and guest participation remain subject to final confirmation.</p>
      </div>
      <div style={{ marginTop: "34px", font: "11px 'Space Mono',monospace", letterSpacing: "3px", color: "#c8952b" }}>CONTENTS<br /><br data-om-id="7df265ae:26" /></div>
      <div style={{ marginTop: "8px", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "26px", padding: "13px 0", borderBottom: "1px solid #e8e3d7" }}><span style={{ font: "13px 'Space Mono',monospace", letterSpacing: "2px", color: "#c8952b" }}>01</span><span style={{ fontFamily: "Spectral,serif", fontSize: "16px", fontWeight: "600" }}>A Connected View of China's AI Ecosystem</span></div>
        <div style={{ display: "flex", alignItems: "baseline", gap: "26px", padding: "13px 0", borderBottom: "1px solid #e8e3d7" }}><span style={{ font: "13px 'Space Mono',monospace", letterSpacing: "2px", color: "#c8952b" }}>02</span><span style={{ fontFamily: "Spectral,serif", fontSize: "16px", fontWeight: "600" }}>What You Will Gain</span></div>
        <div style={{ display: "flex", alignItems: "baseline", gap: "26px", padding: "13px 0", borderBottom: "1px solid #e8e3d7" }}><span style={{ font: "13px 'Space Mono',monospace", letterSpacing: "2px", color: "#c8952b" }}>03</span><span style={{ fontFamily: "Spectral,serif", fontSize: "16px", fontWeight: "600" }}>Seven-Day Itinerary</span></div>
        <div style={{ display: "flex", alignItems: "baseline", gap: "26px", padding: "13px 0", borderBottom: "1px solid #e8e3d7" }}><span style={{ font: "13px 'Space Mono',monospace", letterSpacing: "2px", color: "#c8952b" }}>04</span><span style={{ fontFamily: "Spectral,serif", fontSize: "16px", fontWeight: "600" }}>Pricing and Application</span></div>
        <div style={{ display: "flex", alignItems: "baseline", gap: "26px", padding: "13px 0", borderBottom: "1px solid #e8e3d7" }}><span style={{ font: "13px 'Space Mono',monospace", letterSpacing: "2px", color: "#c8952b" }}>05</span><span style={{ fontFamily: "Spectral,serif", fontSize: "16px", fontWeight: "600" }}>Logistics and Accommodation</span></div>
      </div>
      </section>
    
    
    
    <section className="dossier-section" data-screen-label="02" style={{ padding: "0 0 54px", display: "flex", flexDirection: "column", fontFamily: "'Noto Sans SC',sans-serif", color: "#16305c" }}>
      <div style={{ marginTop: "30px", display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ display: "block", width: "18px", height: "2px", background: "#c8952b" }}></span>
        <span style={{ font: "12px 'Space Mono',monospace", letterSpacing: "3px", color: "#c8952b" }}>0 / PROGRAM OVERVIEW</span>
      </div>
      <h2 style={{ margin: "16px 0 0", fontFamily: "Spectral,serif", fontSize: "26px", fontWeight: "600", lineHeight: "1.28", maxWidth: "24em" }}><br />The Arch: 6 Days + 5 Nights China Innovation Residency in Shanghai<br /><br /></h2>
      <p style={{ margin: "26px 0 0", fontSize: "19px", lineHeight: "1.72", color: "#2b3d5c", textWrap: "pretty" }}>The Arch brings international founders, investors, corporate venture teams, and innovation leaders into Shanghai's AI ecosystem for <span style={{ color: "rgb(200, 149, 43)", fontWeight: "500" }}>one focused week</span>. The program follows how ideas move from models and research into products, established businesses, and real operating environments. Company visits, founder showcases, research sessions, and private conversations are designed to help participants connect technical progress with the decisions that shape adoption and growth.<br /><br /></p>
      <div style={{ marginTop: "46px", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "22px", alignItems: "start" }}>
        <div style={{ background: "#16305c", color: "#f7f1e3", borderRadius: "16px", padding: "22px 20px 26px", boxShadow: "9px 9px 0 #c8952b", position: "relative", overflow: "hidden", width: "179px", height: "284px" }}>
          <span style={{ position: "absolute", top: "-26px", right: "-22px", width: "96px", height: "96px", borderRadius: "50%", background: "rgba(255,255,255,.07)" }}></span>
          <div style={{ font: "26px 'Space Mono',monospace", fontWeight: "700", color: "#e0b04a", letterSpacing: "1px" }}>01</div>
          <div style={{ marginTop: "14px", font: "10px 'Space Mono',monospace", letterSpacing: "2px", color: "#e0b04a", lineHeight: "1.5" }}>INDUSTRY &amp; ENTERPRISE AI</div>
          <p style={{ margin: "14px 0 0", fontSize: "16px", lineHeight: "1.65", color: "rgba(247,241,227,.9)" }}>Intelligent manufacturing, cloud infrastructure, and how Chinese companies move AI into operating workflows.</p>
        </div>
        <div style={{ background: "#f9f6ef", borderRadius: "16px", padding: "22px 20px 26px", boxShadow: "9px 9px 0 #c8952b", width: "173px", height: "286px" }}>
          <div style={{ font: "26px 'Space Mono',monospace", fontWeight: "700", color: "#16305c", letterSpacing: "1px" }}>02</div>
          <div style={{ marginTop: "14px", font: "10px 'Space Mono',monospace", letterSpacing: "2px", color: "#16305c", lineHeight: "1.5" }}>MODELS, RESEARCH &amp; BUILDERS</div>
          <p style={{ margin: "14px 0 0", fontSize: "16px", lineHeight: "1.65", color: "#2b3d5c" }}>Foundation models, AI-native products, university research, and the next generation of founders.</p>
        </div>
        <div style={{ background: "#f7f1e3", borderRadius: "16px", padding: "22px 20px 26px", boxShadow: "9px 9px 0 #8ab6e2", width: "169px", height: "286px" }}>
          <div style={{ font: "26px 'Space Mono',monospace", fontWeight: "700", color: "#16305c", letterSpacing: "1px" }}>03</div>
          <div style={{ marginTop: "14px", font: "10px 'Space Mono',monospace", letterSpacing: "2px", color: "#c8952b", lineHeight: "1.5" }}>SCIENCE, CAPITAL &amp; GLOBAL MARKETS</div>
          <p style={{ margin: "14px 0 0", fontSize: "16px", lineHeight: "1.65", color: "#2b3d5c" }}>AI for Science, investment judgment, commercialization, and products designed for international users.</p>
        </div>
      </div>
      </section><section className="dossier-section" data-screen-label="03" style={{ padding: "0 0 54px", display: "flex", flexDirection: "column", fontFamily: "'Noto Sans SC',sans-serif", color: "#16305c" }}>
      <div style={{ marginTop: "30px", display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ display: "block", width: "18px", height: "2px", background: "rgb(200, 149, 43)" }}><br /><br /></span>
        <span style={{ font: "12px 'Space Mono', monospace", letterSpacing: "3px", color: "rgb(200, 149, 43)" }}>1 / A CONNECTED VIEW OF CHINA'S AI ECOSYSTEM</span>
      </div>
      <h2 style={{ margin: "14px 0 0", fontFamily: "Spectral,serif", fontSize: "26px", fontWeight: "600", textTransform: "uppercase", letterSpacing: ".01em" }}>How the week connects together</h2>
      <div style={{ marginTop: "38px", display: "flex", flexDirection: "column", gap: "30px" }}>
        <div style={{ background: "#f7f1e3", borderRadius: "16px", padding: "20px 24px 24px", boxShadow: "11px 11px 0 #c8952b", width: "637px", height: "160px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <span style={{ font: "11px 'Space Mono',monospace", letterSpacing: "1px", color: "#fff", background: "#16305c", padding: "4px 9px", borderRadius: "5px" }}>1.1</span>
            <span style={{ fontFamily: "Spectral,serif", fontSize: "18px", fontWeight: "600" }}>One Week, One Connected View</span>
          </div>
          <p style={{ margin: "14px 0 0", fontSize: "17px", lineHeight: "1.7", color: "#2b3d5c" }}>The schedule brings model teams, cloud platforms, enterprise software companies, universities, young founders, and investors into one sequence. Each visit adds context to the next, making it easier to see how technical choices change once a product meets customers, operations, regulation, and cost.</p>
        </div>
        <div style={{ background: "#f7f1e3", borderRadius: "16px", padding: "20px 24px 24px", boxShadow: "11px 11px 0 #c8952b", width: "639px", height: "167px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <span style={{ font: "11px 'Space Mono',monospace", letterSpacing: "1px", color: "#fff", background: "#16305c", padding: "4px 9px", borderRadius: "5px" }}>1.2</span>
            <span style={{ fontFamily: "Spectral,serif", fontSize: "18px", fontWeight: "600" }}>From Factory Transformation to AI-Native Products</span>
          </div>
          <p style={{ margin: "14px 0 0", fontSize: "17px", lineHeight: "1.7", color: "#2b3d5c" }}>The week begins with the digital foundations of intelligent manufacturing, then moves into models, enterprise AI, travel, health, content, and workplace tools. Research institutions and early-stage product teams add a view of what may come next.</p>
        </div>
        <div style={{ background: "#f7f1e3", borderRadius: "16px", padding: "20px 24px 24px", boxShadow: "11px 11px 0 #c8952b", width: "643px", height: "191px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <span style={{ font: "11px 'Space Mono',monospace", letterSpacing: "1px", color: "#fff", background: "#16305c", padding: "4px 9px", borderRadius: "5px" }}>1.3</span>
            <span style={{ fontFamily: "Spectral,serif", fontSize: "18px", fontWeight: "600" }}>The People Behind the Ecosystem</span>
          </div>
          <p style={{ margin: "14px 0 0", fontSize: "17px", lineHeight: "1.7", color: "#2b3d5c" }}>Executives will explain how new systems enter established organizations. Researchers will discuss how scientific work is validated and transferred, while founders will share how products are shaped around early users and global markets. These conversations give participants a stronger basis for partnership, investment, and market decisions.</p>
        </div>
      </div>
      </section>
    
    <section className="dossier-section" data-screen-label="04" style={{ padding: "0 0 54px", display: "flex", flexDirection: "column", fontFamily: "'Noto Sans SC',sans-serif", color: "#16305c" }}>
      <div style={{ marginTop: "30px", display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ display: "block", width: "18px", height: "2px", background: "rgb(200, 149, 43)" }}><br /><br /></span>
        <span style={{ font: "12px 'Space Mono', monospace", letterSpacing: "3px", color: "rgb(200, 149, 43)" }}>2 / WHAT YOU WILL GAIN</span>
      </div>
      <h2 style={{ margin: "14px 0 0", fontFamily: "Spectral,serif", fontSize: "26px", fontWeight: "600", textTransform: "uppercase" }}>A practical view you can use</h2>
      <p style={{ margin: "16px 0 0", fontSize: "14px", lineHeight: "1.7", color: "#2b3d5c" }}>By the end of the week, participants will have <span style={{ color: "#c8952b", fontWeight: "500" }}>a working map of China's AI ecosystem</span> and a clearer view of the teams, technologies, and operating models worth following. The program is built to support product, investment, partnership, and market decisions after the visit.</p>
      <div style={{ marginTop: "32px", display: "flex", flexDirection: "column", gap: "26px" }}>
        <div style={{ background: "#f7f1e3", borderRadius: "16px", padding: "18px 22px 22px", boxShadow: "11px 11px 0 #c8952b" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <span style={{ font: "11px 'Space Mono',monospace", letterSpacing: "1px", color: "#fff", background: "#16305c", padding: "4px 9px", borderRadius: "5px" }}>2.1</span>
            <span style={{ fontFamily: "Spectral,serif", fontSize: "17px", fontWeight: "600" }}>Understand How the Ecosystem Fits Together</span>
          </div>
          <p style={{ margin: "12px 0 0", fontSize: "12.5px", lineHeight: "1.68", color: "#2b3d5c" }}>See where foundation-model companies, cloud platforms, enterprise software providers, AI-native startups, universities, and investors sit in the wider market. The week also shows how talent, customers, technical resources, and capital move between them.</p>
        </div>
        <div style={{ background: "#f7f1e3", borderRadius: "16px", padding: "18px 22px 22px", boxShadow: "11px 11px 0 #c8952b" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <span style={{ font: "11px 'Space Mono',monospace", letterSpacing: "1px", color: "#fff", background: "#16305c", padding: "4px 9px", borderRadius: "5px" }}>2.2</span>
            <span style={{ fontFamily: "Spectral,serif", fontSize: "17px", fontWeight: "600" }}>Build Judgment Through Operating Context</span>
          </div>
          <p style={{ margin: "12px 0 0", fontSize: "12.5px", lineHeight: "1.68", color: "#2b3d5c" }}>The program looks closely at how Chinese companies adopt AI in manufacturing, travel, health, content, and workplace settings. Participants will hear where adoption begins, which processes need to change, how teams manage cost and data, and what helps a pilot become a product that can be used repeatedly.</p>
        </div>
        <div style={{ background: "#f7f1e3", borderRadius: "16px", padding: "18px 22px 22px", boxShadow: "11px 11px 0 #c8952b" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <span style={{ font: "11px 'Space Mono',monospace", letterSpacing: "1px", color: "#fff", background: "#16305c", padding: "4px 9px", borderRadius: "5px" }}>2.3</span>
            <span style={{ fontFamily: "Spectral,serif", fontSize: "17px", fontWeight: "600" }}>Connections with a Reason to Continue</span>
          </div>
          <p style={{ margin: "12px 0 0", fontSize: "12.5px", lineHeight: "1.68", color: "#2b3d5c" }}>Founder showcases, company visits, research sessions, and roundtables create several points for direct conversation. Some may lead to product pilots, joint development, market partnerships, investment discussions, or talent introductions. The Arch team will help carry forward the most relevant introductions after the week.</p>
        </div>
      </div>
      <div style={{ marginTop: "34px", font: "11px 'Space Mono',monospace", letterSpacing: "3px", color: "#c8952b" }}>SHANGHAI WEEK FOCUS</div>
      <div style={{ marginTop: "14px", display: "flex", flexWrap: "wrap", gap: "12px" }}>
        <span style={{ font: "10.5px 'Space Mono',monospace", letterSpacing: "1.5px", color: "#16305c", border: "1px solid #16305c", borderRadius: "999px", padding: "8px 16px" }}>INTELLIGENT MANUFACTURING</span>
        <span style={{ font: "10.5px 'Space Mono',monospace", letterSpacing: "1.5px", color: "#16305c", border: "1px solid #16305c", borderRadius: "999px", padding: "8px 16px" }}>FOUNDATION MODELS &amp; AI-NATIVE</span>
        <span style={{ font: "10.5px 'Space Mono',monospace", letterSpacing: "1.5px", color: "#16305c", border: "1px solid #16305c", borderRadius: "999px", padding: "8px 16px" }}>SECTOR ADOPTION</span>
        <span style={{ font: "10.5px 'Space Mono',monospace", letterSpacing: "1.5px", color: "#16305c", border: "1px solid #16305c", borderRadius: "999px", padding: "8px 16px" }}>UNIVERSITIES &amp; YOUNG FOUNDERS</span>
        <span style={{ font: "10.5px 'Space Mono',monospace", letterSpacing: "1.5px", color: "#16305c", border: "1px solid #16305c", borderRadius: "999px", padding: "8px 16px" }}>AI FOR SCIENCE</span>
        <span style={{ font: "10.5px 'Space Mono',monospace", letterSpacing: "1.5px", color: "#16305c", border: "1px solid #16305c", borderRadius: "999px", padding: "8px 16px" }}>CAPITAL &amp; COMMERCIALIZATION</span>
      </div>
      </section>
    
    <section className="dossier-section" data-screen-label="05" style={{ padding: "0 0 54px", display: "flex", flexDirection: "column", fontFamily: "'Noto Sans SC',sans-serif", color: "#16305c" }}>
      <div style={{ marginTop: "26px", display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ display: "block", width: "18px", height: "2px", background: "#c8952b" }}></span>
        <span style={{ font: "12px 'Space Mono',monospace", letterSpacing: "3px", color: "#c8952b" }}>3 / SEVEN-DAY ITINERARY</span>
      </div>
      <h2 style={{ margin: "12px 0 0", fontFamily: "Spectral,serif", fontSize: "24px", fontWeight: "600", textTransform: "uppercase" }}>Day-by-day</h2>
      <p style={{ margin: "14px 0 0", fontSize: "13.5px", lineHeight: "1.68", color: "#2b3d5c" }}>The Shanghai program brings together company visits, research sessions, founder showcases, roundtables, and cultural experiences. Each day builds on the previous one, giving participants time to compare different parts of the ecosystem, ask better questions, and continue valuable conversations throughout the week.</p>
      <p style={{ margin: "16px 0 0", fontFamily: "Spectral,serif", fontStyle: "italic", fontSize: "11.5px", lineHeight: "1.6", color: "#8a8f98" }}>Please note: Each session is arranged directly with the companies and institutions involved. As many visits depend on the schedules of senior leaders and operating teams, the order of the programme and exact meeting times may be adjusted closer to the date. Any updates will stay aligned with the focus and quality of the Shanghai week. Participants will receive the complete schedule, meeting details, and preparation notes before the programme begins.</p>
      <div style={{ marginTop: "26px", display: "flex", alignItems: "baseline", gap: "16px" }}>
        <span style={{ fontFamily: "Spectral,serif", fontWeight: "700", fontSize: "28px", letterSpacing: "-.01em" }}>DAY 1</span>
        <span style={{ fontFamily: "Spectral,serif", fontSize: "17px", fontWeight: "600" }}>Arrival and First Connections</span>
      </div>
      <div style={{ marginTop: "4px", font: "10.5px 'Space Mono',monospace", letterSpacing: "2px", color: "#a9aeb6" }}>DAY 1 OF 6 · SHANGHAI</div>
      <div style={{ marginTop: "18px", display: "flex", flexDirection: "column", gap: "26px" }}>
        <div style={{ background: "#f7f1e3", borderRadius: "16px", padding: "18px 22px 22px", boxShadow: "11px 11px 0 #c8952b" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <span style={{ font: "11px 'Space Mono',monospace", letterSpacing: "1px", color: "#fff", background: "#16305c", padding: "4px 9px", borderRadius: "5px" }}>1.1</span>
            <span style={{ fontFamily: "Spectral,serif", fontSize: "17px", fontWeight: "600" }}>Arrival and Check-in</span>
          </div>
          <div style={{ marginTop: "12px" }}><span style={{ font: "9.5px 'Space Mono',monospace", letterSpacing: "1.5px", color: "#fff", background: "#4cae5a", padding: "5px 11px", borderRadius: "999px" }}>COMMUNITY + ORIENTATION</span></div>
          <p style={{ margin: "16px 0 0", fontSize: "13px", lineHeight: "1.7", color: "#2b3d5c" }}>The first afternoon is intentionally light, giving participants time to arrive, settle in, and get to know the group. The Arch team will also speak with each person about the products, markets, and questions they want to prioritize during the week. Accommodation arrangements for one-week participants will be confirmed separately.</p>
        </div>
        <div style={{ background: "#e7f1fb", borderRadius: "20px", padding: "18px 22px 22px", boxShadow: "11px 11px 0 #8ab6e2", width: "670px", height: "240px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <span style={{ font: "11px 'Space Mono',monospace", letterSpacing: "1px", color: "#fff", background: "#16305c", padding: "4px 9px", borderRadius: "5px" }}>1.2</span>
            <span style={{ fontFamily: "Spectral,serif", fontSize: "17px", fontWeight: "600" }}>Welcome Dinner</span>
          </div>
          <div style={{ marginTop: "12px" }}><span style={{ font: "9.5px 'Space Mono',monospace", letterSpacing: "1.5px", color: "#fff", background: "#4cae5a", padding: "5px 11px", borderRadius: "999px" }}>COMMUNITY + CONNECTIONS</span></div>
          <div style={{ marginTop: "14px", display: "flex", gap: "18px", alignItems: "flex-start" }}>
            <DossierImage src="/dossier/welcome-dinner.jpg" alt="welcome dinner photo" style={{ width: "126px", height: "104px", flex: "none" }} />
            <p style={{ margin: "0", fontSize: "13px", lineHeight: "1.7", color: "#2b3d5c" }}>The week opens with a hosted dinner and the first full introduction to the group. Founders can share what they are building, investors can explain the themes they are following, and corporate leaders can outline the technologies or partnerships they are looking for. These early conversations help shape more relevant introductions throughout the week.</p>
          </div>
        </div>
      </div>
      </section>
    
    
    
    <section className="dossier-section" data-screen-label="06" style={{ padding: "0 0 54px", display: "flex", flexDirection: "column", fontFamily: "'Noto Sans SC',sans-serif", color: "#16305c" }}>
      <div style={{ marginTop: "26px", display: "flex", alignItems: "baseline", gap: "16px" }}>
        <span style={{ fontFamily: "Spectral, serif", fontWeight: "700", fontSize: "28px" }}>DAY 2</span>
        <span style={{ fontFamily: "Spectral, serif", fontSize: "17px", fontWeight: "600" }}>How Chinese Factories Are Moving Toward Intelligent Manufacturing<br /><br /></span>
      </div>
      <div style={{ marginTop: "4px", font: "10.5px 'Space Mono',monospace", letterSpacing: "2px", color: "#a9aeb6" }}>DAY 2 OF 6 · OPENING SESSIONS, BLACK LAKE TECHNOLOGIES AND SUZHOU CREEK<br /></div>
      <div style={{ marginTop: "22px", display: "flex", flexDirection: "column", gap: "28px" }}>
        
        <div style={{ background: "#f7f1e3", borderRadius: "16px", padding: "18px 22px 22px", boxShadow: "11px 11px 0 #c8952b", width: "647px", height: "293px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <span style={{ font: "11px 'Space Mono',monospace", letterSpacing: "1px", color: "#fff", background: "#16305c", padding: "4px 9px", borderRadius: "5px" }}>2.1</span>
            <span style={{ fontFamily: "Spectral,serif", fontSize: "17px", fontWeight: "600" }}>China AI and Technology Landscape</span>
          </div>
          <div style={{ marginTop: "12px" }}><span style={{ font: "9.5px 'Space Mono',monospace", letterSpacing: "1.5px", color: "#fff", background: "#2f6fd0", padding: "5px 11px", borderRadius: "999px" }}>AI + ECOSYSTEM</span></div>
          <p style={{ margin: "14px 0 0", fontSize: "15px", lineHeight: "1.7", color: "#2b3d5c" }}>Before the first company visit, The Arch team will begin with one question: <span style={{ color: "#c8952b", fontWeight: "500" }}>What brought you to China's AI ecosystem, and what do you most want to see for yourself?</span></p>
          <p style={{ margin: "12px 0 0", fontSize: "15px", lineHeight: "1.7", color: "#2b3d5c" }}>The session will map the key players shaping the market, from foundation models and cloud platforms to enterprise software, research institutions, and sector-specific applications. It will also connect these areas to the week ahead, helping participants understand <span style={{ color: "#c8952b", fontWeight: "500" }}>why each visit matters</span> and arrive with sharper questions.</p>
          <p style={{ margin: "12px 0 0", fontSize: "15px", lineHeight: "1.7", color: "#2b3d5c" }}>There also will be <span style={{ color: "#c8952b", fontWeight: "500" }}>an icebreaker</span> that gives everyone a chance to introduce their background, making it easier to get to know each other.</p>
        </div><div style={{ background: "#f7f1e3", borderRadius: "16px", padding: "18px 22px 22px", boxShadow: "11px 11px 0 #c8952b", width: "653px", height: "299px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <span style={{ font: "11px 'Space Mono',monospace", letterSpacing: "1px", color: "#fff", background: "#16305c", padding: "4px 9px", borderRadius: "5px" }}>2.2</span>
            <span style={{ fontFamily: "Spectral,serif", fontSize: "17px", fontWeight: "600" }}>Black Lake Technologies: No. 1 in Factory SaaS</span>
          </div>
          <div style={{ marginTop: "12px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <span style={{ font: "9.5px 'Space Mono',monospace", letterSpacing: "1.5px", color: "#fff", background: "#c0392b", padding: "5px 11px", borderRadius: "999px" }}>INDUSTRIAL SOFTWARE LEADER</span>
            <span style={{ font: "9.5px 'Space Mono',monospace", letterSpacing: "1.5px", color: "#fff", background: "#2f6fd0", padding: "5px 11px", borderRadius: "999px" }}>AI + INTELLIGENT MANUFACTURING</span>
          </div>
          <div style={{ marginTop: "14px", display: "flex", gap: "20px", alignItems: "flex-start" }}>
            <div style={{ flex: "1" }}>
              <p style={{ margin: "0", fontSize: "15px", lineHeight: "1.7", color: "#2b3d5c" }}>Founded in 2016, Black Lake Technologies is a leading cloud-native company helping factories and supply chains move through digital transformation, with <span style={{ color: "#c8952b", fontWeight: "500" }}>over US$100 million raised to date</span>.</p>
              <p style={{ margin: "12px 0 0", fontSize: "15px", lineHeight: "1.7", color: "#2b3d5c" }}>The visit will begin in the company showroom, where participants can see how industrial software connects production planning, equipment management, quality control, and frontline teams through real factory use cases. The session will show <span style={{ color: "#c8952b", fontWeight: "500" }}>where digital transformation usually begins</span>, which workflows tend to change first, and where AI is starting to enter day-to-day production.</p>
            </div>
            <DossierImage src="/dossier/blacklake.jpg" alt="showroom photo" style={{ width: "118px", height: "150px", flex: "none" }} />
          </div>
        </div>
      </div>
      </section><section className="dossier-section" data-screen-label="07" style={{ padding: "0 0 54px", display: "flex", flexDirection: "column", fontFamily: "'Noto Sans SC',sans-serif", color: "#16305c" }}>
      <div style={{ marginTop: "24px", background: "#e7f1fb", borderRadius: "20px", padding: "16px 18px 22px", boxShadow: "11px 11px 0 #8ab6e2" }}>
        <DossierImage src="/dossier/suzhou-creek.jpg" alt="Suzhou Creek photo" style={{ width: "100%", height: "150px", display: "block" }} />
        <div style={{ marginTop: "16px", display: "flex", alignItems: "center", gap: "14px" }}>
          <span style={{ font: "11px 'Space Mono',monospace", letterSpacing: "1px", color: "#fff", background: "#16305c", padding: "4px 9px", borderRadius: "5px" }}>2.3</span>
          <span style={{ fontFamily: "Spectral,serif", fontSize: "17px", fontWeight: "600" }}>Suzhou Creek Walk and Informal Exchange</span>
        </div>
        <div style={{ marginTop: "12px" }}><span style={{ font: "9.5px 'Space Mono',monospace", letterSpacing: "1.5px", color: "#fff", background: "#e2725b", padding: "5px 11px", borderRadius: "999px" }}>CULTURAL EXPERIENCE</span></div>
        <p style={{ margin: "14px 0 0", fontSize: "13px", lineHeight: "1.7", color: "#2b3d5c" }}>The day winds down with a gentle walk along Suzhou Creek, <span style={{ color: "#c8952b", fontWeight: "500" }}>one of Shanghai's most atmospheric waterfronts</span>. Along the way, the group can enjoy the river views and see restored industrial buildings, tree-lined paths, bridges, cafés, and creative spaces come together.</p>
        <p style={{ margin: "12px 0 0", fontSize: "13px", lineHeight: "1.7", color: "#2b3d5c" }}>It is also a quieter moment to <span style={{ color: "#c8952b", fontWeight: "500" }}>continue the day's conversations and get to know one another</span> beyond the formal program. A shorter route will be available for those who prefer a more relaxed pace.</p>
      </div>
      <div style={{ marginTop: "30px", display: "flex", alignItems: "baseline", gap: "16px" }}>
        <span style={{ fontFamily: "Spectral,serif", fontWeight: "700", fontSize: "28px" }}>DAY 3</span>
        <span style={{ fontFamily: "Spectral,serif", fontSize: "17px", fontWeight: "600" }}>Foundation Models, AI-Native Products and Enterprise AI</span>
      </div>
      <div style={{ marginTop: "4px", font: "10.5px 'Space Mono',monospace", letterSpacing: "2px", color: "#a9aeb6" }}>DAY 3 OF 6 · MOSU SPACE, ENTERPRISE PLATFORMS AND THE RIVERFRONT</div>
      <div style={{ marginTop: "20px", background: "#f7f1e3", borderRadius: "16px", padding: "18px 22px 22px", boxShadow: "11px 11px 0 #c8952b" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <span style={{ font: "11px 'Space Mono',monospace", letterSpacing: "1px", color: "#fff", background: "#16305c", padding: "4px 9px", borderRadius: "5px" }}>3.1</span>
          <span style={{ fontFamily: "Spectral,serif", fontSize: "17px", fontWeight: "600" }}>Shanghai Foundation Model Innovation Center</span>
        </div>
        <div style={{ marginTop: "12px" }}><span style={{ font: "9.5px 'Space Mono',monospace", letterSpacing: "1.5px", color: "#fff", background: "#2f6fd0", padding: "5px 11px", borderRadius: "999px" }}>AI + FOUNDATION MODELS</span></div>
        <div style={{ marginTop: "14px", display: "flex", gap: "20px", alignItems: "flex-start" }}>
          <div style={{ flex: "1" }}>
            <p style={{ margin: "0", fontSize: "12.5px", lineHeight: "1.7", color: "#2b3d5c" }}>Shanghai Foundation Model Innovation Center is China's first innovation community dedicated entirely to foundation models and generative AI. It has already brought together <span style={{ color: "#c8952b", fontWeight: "500" }}>more than 300 AI companies</span>, all focused on generative AI, making it <span style={{ color: "#c8952b", fontWeight: "500" }}>one of the country's most concentrated foundation-model clusters</span>.</p>
            <p style={{ margin: "12px 0 0", fontSize: "12.5px", lineHeight: "1.7", color: "#2b3d5c" }}>During the visit, participants will tour the space, see live product demos, and speak directly with founders. It is a chance to compare different technical paths and product ideas in one place, and to see which model capabilities are already attracting real users and growing into new companies.</p>
          </div>
          <DossierImage src="/dossier/mosu-space.jpg" alt="MOSU space photo" style={{ width: "110px", height: "130px", flex: "none" }} />
        </div>
      </div>
      </section>
    
    <section className="dossier-section" data-screen-label="08" style={{ padding: "0 0 54px", display: "flex", flexDirection: "column", fontFamily: "'Noto Sans SC',sans-serif", color: "#16305c", width: "722px", height: "830px" }}>
      <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "28px", width: "699px", height: "848px" }}>
        <div style={{ background: "#f7f1e3", borderRadius: "16px", padding: "18px 22px 22px", boxShadow: "11px 11px 0 #c8952b", width: "655px", height: "237px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <span style={{ font: "11px 'Space Mono',monospace", letterSpacing: "1px", color: "#fff", background: "#16305c", padding: "4px 9px", borderRadius: "5px" }}>3.2</span>
            <span style={{ fontFamily: "Spectral,serif", fontSize: "17px", fontWeight: "600" }}>Alibaba Cloud (NYSE: BABA · HKEX: 9988)</span>
          </div>
          <div style={{ marginTop: "12px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <span style={{ font: "9.5px 'Space Mono',monospace", letterSpacing: "1.5px", color: "#fff", background: "#2f6fd0", padding: "5px 11px", borderRadius: "999px" }}>AI + ENTERPRISE PRODUCTIVITY</span>
            <span style={{ font: "9.5px 'Space Mono',monospace", letterSpacing: "1.5px", color: "#fff", background: "#c0392b", padding: "5px 11px", borderRadius: "999px" }}>CLOUD &amp; AI LEADER</span>
          </div>
          <div style={{ marginTop: "14px", display: "flex", gap: "20px", alignItems: "flex-start" }}>
            <div style={{ flex: "1" }}>
              <p style={{ margin: "0", fontSize: "12px", lineHeight: "1.7", color: "#2b3d5c" }}>Founded in 2009, Alibaba Cloud is Alibaba Group's cloud and AI platform and one of China's leading providers. <span style={{ color: "#c8952b", fontWeight: "500" }}>It is the earliest cloud in China.</span> In Chinese people's daily life, it supports everything from Taobao and Tmall to public services, traffic systems, and industrial digitization, offering a practical view of <span style={{ color: "#c8952b", fontWeight: "500" }}>how China's digital economy operates at scale</span>.</p>
              <p style={{ margin: "10px 0 0", fontSize: "12px", lineHeight: "1.7", color: "#2b3d5c" }}>During the visit, we'll explore model deployment, agent development, and enterprise integration, along with the real challenges around reliability, data security, and cost. Participants will see how cloud and foundation models become <span style={{ color: "#c8952b", fontWeight: "500" }}>products used by millions</span> and deployed in real operations.</p>
            </div>
            <DossierImage src="/dossier/alibaba-cloud.jpg" alt="Alibaba Cloud photo" style={{ width: "112px", height: "118px", flex: "none" }} />
          </div>
        </div>
        <div style={{ background: "#f7f1e3", borderRadius: "16px", padding: "16px 18px 22px", boxShadow: "11px 11px 0 #c8952b", width: "663px", height: "260px" }}>
          <DossierImage src="/dossier/ant-group.jpg" alt="Ant Group photo" style={{ width: "670px", height: "77px", display: "block" }} />
          <div style={{ marginTop: "16px", display: "flex", alignItems: "center", gap: "14px" }}>
            <span style={{ font: "11px 'Space Mono',monospace", letterSpacing: "1px", color: "#fff", background: "#16305c", padding: "4px 9px", borderRadius: "5px" }}>3.3</span>
            <span style={{ fontFamily: "Spectral,serif", fontSize: "17px", fontWeight: "600" }}>Ant Group</span>
          </div>
          <div style={{ marginTop: "12px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <span style={{ font: "9.5px 'Space Mono',monospace", letterSpacing: "1.5px", color: "#fff", background: "#2f6fd0", padding: "5px 11px", borderRadius: "999px" }}>AI + HEALTH</span>
            <span style={{ font: "9.5px 'Space Mono',monospace", letterSpacing: "1.5px", color: "#fff", background: "#c0392b", padding: "5px 11px", borderRadius: "999px" }}>DIGITAL TECHNOLOGY LEADER</span>
          </div>
          <p style={{ margin: "14px 0 0", fontSize: "12px", lineHeight: "1.7", color: "#2b3d5c" }}>Ant Group is best known for Alipay, one of China's most widely used digital payment platforms. With <span style={{ color: "#c8952b", fontWeight: "500" }}>years of experience in high-frequency digital services</span>, Ant offers a different view of AI, one shaped by sensitive data, risk management, and user trust. During our visit, Ant's product and technology teams will share how AI is being used in healthcare and digital services, how new products are tested, and how they are integrated into mature platforms. Participants will see <span style={{ color: "#c8952b", fontWeight: "500" }}>what a large consumer platform needs to validate</span> before an AI product is ready for everyday use.</p>
        </div>
        <div style={{ background: "#e7f1fb", borderRadius: "20px", padding: "18px 22px 22px", boxShadow: "11px 11px 0 #8ab6e2", width: "653px", height: "169px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <span style={{ font: "11px 'Space Mono',monospace", letterSpacing: "1px", color: "#fff", background: "#16305c", padding: "4px 9px", borderRadius: "5px" }}>3.4</span>
            <span style={{ fontFamily: "Spectral,serif", fontSize: "17px", fontWeight: "600" }}>Riverfront Ride and Evening Conversation</span>
          </div>
          <div style={{ marginTop: "12px" }}><span style={{ font: "9.5px 'Space Mono',monospace", letterSpacing: "1.5px", color: "#fff", background: "#e2725b", padding: "5px 11px", borderRadius: "999px" }}>CULTURAL EXPERIENCE</span></div>
          <div style={{ marginTop: "14px", display: "flex", gap: "18px", alignItems: "flex-start" }}>
            <DossierImage src="/dossier/riverfront-ride.jpg" alt="riverfront ride photo" style={{ width: "100px", height: "101px", flex: "none" }} />
            <p style={{ margin: "0", fontSize: "12px", lineHeight: "1.7", color: "#2b3d5c" }}>The evening slows down with a relaxed ride along Shanghai's riverfront, taking in <span style={{ color: "#c8952b", fontWeight: "500" }}>open views of the water, city lights, and the changing skyline</span>. It is a chance to step away from the formal schedule, enjoy the city, and let the day's ideas settle. Along the way, participants can <span style={{ color: "#c8952b", fontWeight: "500" }}>continue conversations in a more casual setting</span> and get to know one another beyond the company visits. Walking and sightseeing alternatives will also be available.</p>
          </div>
        </div>
      </div>
      </section>
    
    <section className="dossier-section" data-screen-label="09" style={{ padding: "0 0 54px", display: "flex", flexDirection: "column", fontFamily: "'Noto Sans SC',sans-serif", color: "#16305c" }}>
      <div style={{ marginTop: "34px", display: "flex", alignItems: "baseline", gap: "16px" }}>
        <span style={{ fontFamily: "Spectral,serif", fontWeight: "700", fontSize: "28px" }}>DAY 4</span>
        <span style={{ fontFamily: "Spectral,serif", fontSize: "17px", fontWeight: "600" }}>Universities, Young Builders and Early-Stage Products</span>
      </div>
      <div style={{ marginTop: "4px", font: "10.5px 'Space Mono',monospace", letterSpacing: "2px", color: "#a9aeb6" }}>DAY 4 OF 6 · RESEARCH INSTITUTIONS, BEIYANG AI TOWN AND FOUNDER SHOWCASES</div>
      <div style={{ marginTop: "22px", display: "flex", flexDirection: "column", gap: "28px" }}>
        <div style={{ background: "#f7f1e3", borderRadius: "16px", padding: "18px 22px 22px", boxShadow: "11px 11px 0 #c8952b", width: "657px", height: "243px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
            <span style={{ font: "11px 'Space Mono',monospace", letterSpacing: "1px", color: "#fff", background: "#16305c", padding: "4px 9px", borderRadius: "5px", marginTop: "3px" }}>4.1</span>
            <span style={{ fontFamily: "Spectral,serif", fontSize: "17px", fontWeight: "600", lineHeight: "1.35" }}>Shanghai Innovation Institute (SII) and HKUST Shanghai Center</span>
          </div>
          <div style={{ marginTop: "12px" }}><span style={{ font: "9.5px 'Space Mono',monospace", letterSpacing: "1.5px", color: "#fff", background: "#2f6fd0", padding: "5px 11px", borderRadius: "999px" }}>AI + TALENT &amp; RESEARCH</span></div>
          <p style={{ margin: "14px 0 0", fontSize: "14px", lineHeight: "1.7", color: "#2b3d5c" }}>Shanghai Innovation Institute is a new education and research platform built for the AI era. Within its first year, it released <span style={{ color: "#c8952b", fontWeight: "500" }}>seven frontier AI projects</span>, including several world-first breakthroughs.</p>
          <p style={{ margin: "12px 0 0", fontSize: "14px", lineHeight: "1.7", color: "#2b3d5c" }}>HKUST's School of Engineering ranks <span style={{ color: "#c8952b", fontWeight: "500" }}>No. 33 globally in the 2027 QS Engineering and Technology rankings</span>. Its Shanghai Center connects university research with startups, industry, and commercialization across the Yangtze River Delta. We will take the group inside both institutions to see how research teams access data and computing power, work with companies, and turn promising ideas into real products.</p>
        </div>
        <div style={{ background: "#f7f1e3", borderRadius: "16px", padding: "18px 22px 22px", boxShadow: "11px 11px 0 #c8952b", width: "669px", height: "389px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <span style={{ font: "11px 'Space Mono',monospace", letterSpacing: "1px", color: "#fff", background: "#16305c", padding: "4px 9px", borderRadius: "5px" }}>4.2</span>
            <span style={{ fontFamily: "Spectral,serif", fontSize: "17px", fontWeight: "600" }}>HongShan Innovation Base at Beiyang AI Town</span>
          </div>
          <div style={{ marginTop: "12px" }}><span style={{ font: "9.5px 'Space Mono',monospace", letterSpacing: "1.5px", color: "#fff", background: "#2f6fd0", padding: "5px 11px", borderRadius: "999px" }}>AI + EARLY-STAGE VENTURES</span></div>
          <div style={{ marginTop: "14px", display: "flex", gap: "20px", alignItems: "flex-start" }}>
            <div style={{ flex: "1" }}>
              <p style={{ margin: "0", fontSize: "14px", lineHeight: "1.7", color: "#2b3d5c" }}>Located inside Beiyang AI Town, the HongShan China Innovation Accelerator is built for young AI founders and early-stage teams. It offers much more than office space, bringing together <span style={{ color: "#c8952b", fontWeight: "500" }}>startup courses, recruiting support, research commercialization, and incubation resources</span> in one low-cost, high-density environment.</p>
              <p style={{ margin: "10px 0 0", fontSize: "14px", lineHeight: "1.7", color: "#2b3d5c" }}>During the visit, we will meet the team behind the accelerator and see how they work with founders at the earliest stage. The conversation will cover how investors <span style={{ color: "#c8952b", fontWeight: "500" }}>spot real technical differentiation, read early market signals</span>, and decide what a team needs to prove before it is ready for the next stage of growth. For anyone interested in startup building or early-stage investment, this visit offers a practical look at how young AI teams in China move from an early idea toward a real company.</p>
            </div>
            <DossierImage src="/dossier/beiyang-ai-town.jpg" alt="Beiyang AI Town photo" style={{ width: "112px", height: "216px", flex: "none" }} />
          </div>
        </div>
      </div>
      </section>
    
    <section className="dossier-section" data-screen-label="10" style={{ padding: "0 0 54px", display: "flex", flexDirection: "column", fontFamily: "'Noto Sans SC',sans-serif", color: "#16305c" }}>
      <div style={{ marginTop: "24px", background: "#f7f1e3", borderRadius: "16px", padding: "16px 22px 22px", boxShadow: "11px 11px 0 #c8952b", width: "661px", height: "379px" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <DossierImage src="/dossier/agi-bar.jpg" alt="AGI Bar photo" style={{ width: "250px", height: "92px", flex: "none" }} />
        </div>
        <div style={{ marginTop: "16px", display: "flex", alignItems: "flex-start", gap: "14px" }}>
          <span style={{ font: "11px 'Space Mono',monospace", letterSpacing: "1px", color: "#fff", background: "#16305c", padding: "4px 9px", borderRadius: "5px", marginTop: "3px" }}>4.3</span>
          <span style={{ fontFamily: "Spectral,serif", fontSize: "17px", fontWeight: "600", lineHeight: "1.35" }}>AI-Native Products, Physical AI and the Next Generation of Builders</span>
        </div>
        <div style={{ marginTop: "12px" }}><span style={{ font: "9.5px 'Space Mono',monospace", letterSpacing: "1.5px", color: "#fff", background: "#2f6fd0", padding: "5px 11px", borderRadius: "999px" }}>AI + NEXT-GEN BUILDERS</span></div>
        <p style={{ margin: "14px 0 0", fontSize: "14px", lineHeight: "1.7", color: "#2b3d5c" }}>Curious what China's post-2005 builders are working on, or what standout projects led by founders born after 2000 look like? This afternoon-to-evening program brings together <span style={{ color: "#c8952b", fontWeight: "500" }}>visual agents, smart glasses, workplace AI hardware, wearables</span>, and other products that connect software with the physical world. Participants will see live demos, meet the teams behind them, and hear how these young builders <span style={{ color: "#c8952b", fontWeight: "500" }}>choose ideas, find collaborators, test products</span>, and think about global users from an early stage. The conversation will continue into the evening, offering a closer look at both the products being built and <span style={{ color: "#c8952b", fontWeight: "500" }}>the people shaping China's next generation of AI companies</span>.</p>
      </div>
      <div style={{ marginTop: "30px", display: "flex", alignItems: "baseline", gap: "16px" }}>
        <span style={{ fontFamily: "Spectral,serif", fontWeight: "700", fontSize: "28px" }}>DAY 5</span>
        <span style={{ fontFamily: "Spectral,serif", fontSize: "17px", fontWeight: "600" }}>AI in Industry and AI for Science</span>
      </div>
      <div style={{ marginTop: "4px", font: "10.5px 'Space Mono',monospace", letterSpacing: "2px", color: "#a9aeb6" }}>DAY 5 OF 6 · INDUSTRY VISIT AND AN AFTERNOON AI FOR SCIENCE PROGRAM</div>
      <div style={{ marginTop: "20px", background: "#f7f1e3", borderRadius: "16px", padding: "18px 22px 22px", boxShadow: "11px 11px 0 #c8952b" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <span style={{ font: "11px 'Space Mono',monospace", letterSpacing: "1px", color: "#fff", background: "#16305c", padding: "4px 9px", borderRadius: "5px" }}>5.1</span>
          <span style={{ fontFamily: "Spectral,serif", fontSize: "17px", fontWeight: "600" }}>Trip.com Group (NASDAQ: TCOM · HKEX: 9961)</span>
        </div>
        <div style={{ marginTop: "12px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <span style={{ font: "9.5px 'Space Mono',monospace", letterSpacing: "1.5px", color: "#fff", background: "#2f6fd0", padding: "5px 11px", borderRadius: "999px" }}>AI + TRAVEL</span>
          <span style={{ font: "9.5px 'Space Mono',monospace", letterSpacing: "1.5px", color: "#fff", background: "#e2725b", padding: "5px 11px", borderRadius: "999px" }}>GLOBAL TRAVEL PLATFORM LEADER</span>
        </div>
        <div style={{ marginTop: "14px", display: "flex", gap: "20px", alignItems: "flex-start" }}>
          <div style={{ flex: "1" }}>
            <p style={{ margin: "0", fontSize: "12.5px", lineHeight: "1.7", color: "#2b3d5c" }}>Founded in 1999 and headquartered in Shanghai, Trip.com Group is one of China's leading online travel companies. Its services reach <span style={{ color: "#c8952b", fontWeight: "500" }}>more than 200 countries and regions</span>, with <span style={{ color: "#c8952b", fontWeight: "500" }}>over 400 million registered users worldwide</span>. Every day, the platform handles huge volumes of travel searches, bookings, and customer requests across different languages and markets. During the visit, we'll explore real business areas such as inbound travel, international flights, personalized recommendations, and global customer support, and see how AI is integrated into an established travel platform.</p>
            <p style={{ margin: "10px 0 0", fontSize: "12.5px", lineHeight: "1.7", color: "#2b3d5c" }}>For anyone building products for international users, this visit offers <span style={{ color: "#c8952b", fontWeight: "500" }}>a practical look at how a Chinese company designs and operates across different markets</span>.</p>
          </div>
          <DossierImage src="/dossier/trip-com.jpg" alt="Trip.com photo" style={{ width: "118px", height: "172px", flex: "none" }} />
        </div>
      </div>
      </section>
    
    <section className="dossier-section" data-screen-label="11" style={{ padding: "0 0 54px", display: "flex", flexDirection: "column", fontFamily: "'Noto Sans SC',sans-serif", color: "#16305c" }}>
      <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "28px", width: "698px", height: "807px" }}>
        <div style={{ background: "#f9f6ef", borderRadius: "16px", padding: "18px 22px 22px", boxShadow: "11px 11px 0 #c8952b", width: "664px", height: "323px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <span style={{ font: "11px 'Space Mono',monospace", letterSpacing: "1px", color: "#fff", background: "#16305c", padding: "4px 9px", borderRadius: "5px" }}>5.2</span>
            <span style={{ fontFamily: "Spectral,serif", fontSize: "17px", fontWeight: "600" }}>SenseTime (HKEX: 0020)</span>
          </div>
          <div style={{ marginTop: "12px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <span style={{ font: "9.5px 'Space Mono',monospace", letterSpacing: "1.5px", color: "#fff", background: "#2f6fd0", padding: "5px 11px", borderRadius: "999px" }}>AI + ENTERPRISE DEPLOYMENT</span>
            <span style={{ font: "9.5px 'Space Mono',monospace", letterSpacing: "1.5px", color: "#fff", background: "#c0392b", padding: "5px 11px", borderRadius: "999px" }}>VISION AI LEADER</span>
          </div>
          <div style={{ marginTop: "14px", display: "flex", gap: "20px", alignItems: "flex-start" }}>
            <div style={{ flex: "1" }}>
              <p style={{ margin: "0", fontSize: "12.5px", lineHeight: "1.7", color: "#2b3d5c" }}>Founded in 2014, SenseTime is one of China's leading companies in multimodal foundation models. Its <span style={{ color: "#c8952b", fontWeight: "500" }}>SenseNova V6.5 model</span> has made advances in reasoning across both text and images, while <span style={{ color: "#c8952b", fontWeight: "500" }}>generative AI now accounts for more than 63% of the company's revenue</span>. SenseTime also offers a useful view of what it takes to move AI beyond a model demo and into real enterprise use.</p>
              <p style={{ margin: "12px 0 0", fontSize: "12.5px", lineHeight: "1.7", color: "#2b3d5c" }}>During the visit, the team will explain how computing power, model services, and application tools come together in a deployable solution. We'll also discuss data preparation, system architecture, performance, and long-term maintenance, helping participants understand <span style={{ color: "#c8952b", fontWeight: "500" }}>the technical and operational challenges companies face when adopting AI</span>.</p>
            </div>
            <DossierImage src="/dossier/sensetime.jpg" alt="SenseTime photo" style={{ width: "116px", height: "196px", flex: "none" }} />
          </div>
        </div>
        <div style={{ background: "#f7f1e3", borderRadius: "16px", padding: "18px 22px 22px", boxShadow: "11px 11px 0 #c8952b", width: "666px", height: "375px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <span style={{ font: "11px 'Space Mono',monospace", letterSpacing: "1px", color: "#fff", background: "#16305c", padding: "4px 9px", borderRadius: "5px" }}>5.3</span>
            <span style={{ fontFamily: "Spectral,serif", fontSize: "17px", fontWeight: "600" }}>Fudan University ✕ Shanghai Academy of AI for Science</span>
          </div>
          <div style={{ marginTop: "12px" }}><span style={{ font: "9.5px 'Space Mono',monospace", letterSpacing: "1.5px", color: "#fff", background: "#2f6fd0", padding: "5px 11px", borderRadius: "999px" }}>AI + SCIENCE</span></div>
          <div style={{ marginTop: "14px", display: "flex", gap: "20px", alignItems: "flex-start" }}>
            <div style={{ flex: "1" }}>
              <p style={{ margin: "0", fontSize: "12.5px", lineHeight: "1.7", color: "#2b3d5c" }}>Fudan University and the Shanghai Academy of AI for Science bring together <span style={{ color: "#c8952b", fontWeight: "500" }}>top research in life sciences, medicine, computing, and AI</span> to explore how technology can accelerate real scientific discovery.</p>
              <p style={{ margin: "10px 0 0", fontSize: "12.5px", lineHeight: "1.7", color: "#2b3d5c" }}>The afternoon begins with a simple question: Can AI really begin to do science? With an initial focus on life sciences, researchers and translational teams from Fudan University and the Shanghai Academy of AI for Science will share how AI is being used to <span style={{ color: "#c8952b", fontWeight: "500" }}>analyze scientific data, build models, support experimental validation</span>, and move promising research closer to practical application.</p>
              <p style={{ margin: "10px 0 0", fontSize: "12.5px", lineHeight: "1.7", color: "#2b3d5c" }}>The conversation will then expand to founders, investors, researchers, and science communicators, exploring <span style={{ color: "#c8952b", fontWeight: "500" }}>what it takes for scientific work to leave the lab</span>. Topics will include access to data and compute, research commercialization, and where startups or companies can begin working with research institutions.</p>
            </div>
            <DossierImage src="/dossier/fudan-campus.jpg" alt="Fudan campus photo" style={{ width: "116px", height: "226px", flex: "none" }} />
          </div>
        </div>
      </div>
      </section>
    
    <section className="dossier-section" data-screen-label="12" style={{ padding: "0 0 54px", display: "flex", flexDirection: "column", fontFamily: "'Noto Sans SC',sans-serif", color: "#16305c" }}>
      <div style={{ marginTop: "26px", display: "flex", alignItems: "baseline", gap: "16px" }}>
        <span style={{ fontFamily: "Spectral,serif", fontWeight: "700", fontSize: "28px" }}>DAY 6</span>
        <span style={{ fontFamily: "Spectral,serif", fontSize: "17px", fontWeight: "600" }}>Generative Content, Capital and Commercialization</span>
      </div>
      <div style={{ marginTop: "4px", font: "10.5px 'Space Mono',monospace", letterSpacing: "2px", color: "#a9aeb6" }}>DAY 6 OF 6 · VOLCANO ENGINE, SEEDANCE AND A VC/PE ROUNDTABLE</div>
      <div style={{ marginTop: "22px", background: "#f7f1e3", borderRadius: "16px", padding: "18px 22px 22px", boxShadow: "11px 11px 0 #c8952b", width: "652px", height: "341px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <span style={{ font: "11px 'Space Mono',monospace", letterSpacing: "1px", color: "#fff", background: "#16305c", padding: "4px 9px", borderRadius: "5px" }}>6.1</span>
          <span style={{ fontFamily: "Spectral,serif", fontSize: "17px", fontWeight: "600" }}>Volcano Engine ✕ Seedance Creative Workflow Workshop</span>
        </div>
        <div style={{ marginTop: "12px" }}><span style={{ font: "9.5px 'Space Mono',monospace", letterSpacing: "1.5px", color: "#fff", background: "#2f6fd0", padding: "5px 11px", borderRadius: "999px" }}>AI + GENERATIVE CONTENT</span></div>
        <div style={{ marginTop: "14px", display: "flex", gap: "20px", alignItems: "flex-start" }}>
          <div style={{ flex: "1" }}>
            <p style={{ margin: "0", fontSize: "14px", lineHeight: "1.7", color: "#2b3d5c" }}>Launched in 2020, Volcano Engine is ByteDance's cloud platform, bringing the technology and tools used inside ByteDance to other companies. <span style={{ color: "#c8952b", fontWeight: "500" }}>Short-form drama has become one of China's fastest-growing forms of mainstream entertainment</span>, and Seedance, developed by ByteDance Seed, is one of the leading models pushing AI-generated video and multi-shot storytelling forward.</p>
            <p style={{ margin: "12px 0 0", fontSize: "14px", lineHeight: "1.7", color: "#2b3d5c" }}>During the visit, participants will see how AI video moves beyond a product demo and into a real production workflow. The hands-on session will cover prompt design, shot planning, and output review, while the team shares what matters when <span style={{ color: "#c8952b", fontWeight: "500" }}>generative video is used at scale</span>, including speed, consistency, quality control, and delivery.</p>
          </div>
          <DossierImage src="/dossier/seedance-demo.jpg" alt="Seedance demo photo" style={{ width: "118px", height: "200px", flex: "none" }} />
        </div>
      </div>
      <div style={{ marginTop: "26px" }}>
        <DossierImage src="/dossier/group.jpg" alt="group photo" style={{ width: "712px", height: "347px", display: "block" }} />
      </div>
      </section>
    
    <section className="dossier-section" data-screen-label="13" style={{ padding: "0 0 54px", display: "flex", flexDirection: "column", fontFamily: "'Noto Sans SC',sans-serif", color: "#16305c" }}>
      <div style={{ marginTop: "24px", background: "#f7f1e3", borderRadius: "16px", padding: "18px 22px 22px", boxShadow: "11px 11px 0 #c8952b" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <span style={{ font: "11px 'Space Mono',monospace", letterSpacing: "1px", color: "#fff", background: "#16305c", padding: "4px 9px", borderRadius: "5px" }}>6.2</span>
          <span style={{ fontFamily: "Spectral,serif", fontSize: "17px", fontWeight: "600" }}>VC/PE Roundtable</span>
        </div>
        <div style={{ marginTop: "12px" }}><span style={{ font: "9.5px 'Space Mono',monospace", letterSpacing: "1.5px", color: "#fff", background: "#2f6fd0", padding: "5px 11px", borderRadius: "999px" }}>AI + INVESTMENT</span></div>
        <p style={{ margin: "14px 0 0", fontSize: "13px", lineHeight: "1.7", color: "#2b3d5c" }}>After a week of company visits, product demos, and research sessions, this roundtable gives the group space to step back and compare what they have seen from an investment perspective.</p>
        <p style={{ margin: "12px 0 0", fontSize: "13px", lineHeight: "1.7", color: "#2b3d5c" }}>The discussion will focus on two questions:</p>
        <p style={{ margin: "6px 0 0", fontSize: "13px", lineHeight: "1.7", color: "#c8952b", fontWeight: "500" }}>· Where are the most promising opportunities for international investors in China's AI market?</p>
        <p style={{ margin: "2px 0 0", fontSize: "13px", lineHeight: "1.7", color: "#c8952b", fontWeight: "500" }}>· Which Chinese AI products, business models, or go-to-market strategies could work in overseas markets?</p>
        <p style={{ margin: "12px 0 0", fontSize: "13px", lineHeight: "1.7", color: "#2b3d5c" }}>Investors, corporate venture teams, and founders will share how they think about technical strength, market timing, commercialization, and global potential. Snacks and drinks will be provided, creating a relaxed setting for open discussion, follow-up questions, and deeper conversations across the group.</p>
      </div>
      <div style={{ marginTop: "30px", background: "#e7f1fb", borderRadius: "20px", padding: "16px 18px 22px", boxShadow: "11px 11px 0 #8ab6e2", width: "662px", height: "396px" }}>
        <DossierImage src="/dossier/farewell-dinner.jpg" alt="farewell dinner photo" style={{ width: "100%", height: "176px", display: "block" }} />
        <div style={{ marginTop: "16px", display: "flex", alignItems: "center", gap: "14px" }}>
          <span style={{ font: "11px 'Space Mono',monospace", letterSpacing: "1px", color: "#fff", background: "#16305c", padding: "4px 9px", borderRadius: "5px" }}>6.3</span>
          <span style={{ fontFamily: "Spectral,serif", fontSize: "17px", fontWeight: "600" }}>Shanghai Week Farewell Dinner</span>
        </div>
        <div style={{ marginTop: "12px" }}><span style={{ font: "9.5px 'Space Mono',monospace", letterSpacing: "1.5px", color: "#fff", background: "#4cae5a", padding: "5px 11px", borderRadius: "999px" }}>COMMUNITY + FOLLOW-UPS</span></div>
        <p style={{ margin: "14px 0 0", fontSize: "13px", lineHeight: "1.7", color: "#2b3d5c" }}>We'll end the Shanghai week with a relaxed dinner together with participants, founders, and ecosystem partners. It is a chance to <span style={{ color: "#c8952b", fontWeight: "500" }}>look back on the most memorable moments</span>, share what surprised us, and continue the conversations that still have energy.</p>
        <p style={{ margin: "12px 0 0", fontSize: "13px", lineHeight: "1.7", color: "#2b3d5c" }}>Over good food and drinks, the group can talk about which companies, projects, or people they would like to stay connected with. <span style={{ color: "#c8952b", fontWeight: "500" }}>The Arch team will help follow up on the most relevant introductions</span> after the program.</p>
      </div>
      </section>
    
    <section className="dossier-section" data-screen-label="14" style={{ padding: "0 0 54px", display: "flex", flexDirection: "column", fontFamily: "'Noto Sans SC',sans-serif", color: "#16305c" }}>
      <h2 style={{ margin: "34px 0 0", fontFamily: "Spectral,serif", fontSize: "24px", fontWeight: "600" }}>Developer Festival and Flexible Next Steps</h2>
      <div style={{ marginTop: "14px" }}><span style={{ display: "inline-block", background: "#e0b04a", color: "#fff", font: "11px 'Space Mono',monospace", letterSpacing: "2px", padding: "8px 16px", borderRadius: "8px" }}>EXTRA BENEFIT · DAY 7</span></div>
      <div style={{ marginTop: "26px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "26px", alignItems: "start" }}>
        <div style={{ background: "#f7f1e3", borderRadius: "16px", padding: "18px 20px 22px", boxShadow: "10px 10px 0 #c8952b" }}>
          <div style={{ font: "10px 'Space Mono',monospace", letterSpacing: "2px", color: "#c8952b" }}>OPTION A</div>
          <div style={{ marginTop: "10px", fontFamily: "Spectral,serif", fontSize: "17px", fontWeight: "600" }}>7.1 · Developer Festival</div>
          <div style={{ marginTop: "12px" }}><span style={{ font: "9.5px 'Space Mono',monospace", letterSpacing: "1.5px", color: "#fff", background: "#2f6fd0", padding: "5px 11px", borderRadius: "999px" }}>AI + DEVELOPER COMMUNITY</span></div>
          <p style={{ margin: "14px 0 0", fontSize: "13px", lineHeight: "1.7", color: "#2b3d5c" }}>As an optional extension to the core program, The Arch team will organize a developer festival featuring local builders, technical speakers, and product teams working with current AI tools. Participants can meet Shanghai's wider developer community, discover new projects, and continue conversations formed during the week. If you would like to share a topic or showcase your project at the festival, please contact us in advance.</p>
        </div>
        <div style={{ background: "#16305c", borderRadius: "16px", padding: "18px 20px 22px", boxShadow: "10px 10px 0 #8ab6e2", color: "#f7f1e3", width: "303px", height: "326px" }}>
          <div style={{ font: "10px 'Space Mono',monospace", letterSpacing: "2px", color: "#e0b04a" }}>OPTION B</div>
          <div style={{ marginTop: "10px", fontFamily: "Spectral,serif", fontSize: "17px", fontWeight: "600" }}>7.2 · Flexible Schedule and Onward Travel</div>
          <div style={{ marginTop: "12px" }}><span style={{ font: "9.5px 'Space Mono',monospace", letterSpacing: "1.5px", color: "#fff", background: "#4cae5a", padding: "5px 11px", borderRadius: "999px" }}>COMMUNITY + NEXT STEPS</span></div>
          <p style={{ margin: "14px 0 0", fontSize: "13px", lineHeight: "1.7", color: "rgba(247,241,227,.9)" }}><br />Participants may also keep the day open for personal meetings, follow-up conversations, or independent plans. Those continuing into the following week can travel with The Arch team to Beijing and join the next stage of the program. Participation in all Day 7 activities is optional.</p>
        </div>
      </div>
      <div style={{ marginTop: "30px" }}>
        <DossierImage src="/dossier/developer-festival.jpg" alt="developer festival photo" style={{ width: "721px", height: "325px", display: "block" }} />
      </div>
      </section>
    
    
    
    <section className="dossier-section" data-screen-label="16" style={{ padding: "0 0 54px", display: "flex", flexDirection: "column", fontFamily: "'Noto Sans SC',sans-serif", color: "#16305c" }}>
      <div style={{ marginTop: "26px", display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ display: "block", width: "18px", height: "2px", background: "#c8952b" }}></span>
        <span style={{ font: "12px 'Space Mono',monospace", letterSpacing: "3px", color: "#c8952b" }}>4 / PRICING AND APPLICATION</span>
      </div>
      <h2 style={{ margin: "12px 0 0", fontFamily: "Spectral,serif", fontSize: "26px", fontWeight: "600", textTransform: "uppercase" }}>Join the Shanghai program</h2>
      <div style={{ marginTop: "24px", display: "flex", alignItems: "center", gap: "30px" }}>
        <div style={{ flex: "1", background: "#16305c", borderRadius: "16px", padding: "20px 24px 24px", boxShadow: "11px 11px 0 #c8952b", color: "#f7f1e3", width: "478px", height: "417px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <span style={{ font: "11px 'Space Mono',monospace", letterSpacing: "1px", color: "#16305c", background: "#e0b04a", padding: "4px 9px", borderRadius: "5px" }}>4.1</span>
            <span style={{ fontFamily: "Spectral,serif", fontSize: "17px", fontWeight: "600" }}>Program Fee</span>
          </div>
          <div style={{ marginTop: "16px", display: "flex", alignItems: "baseline", gap: "12px", flexWrap: "wrap" }}>
            <span style={{ font: "24px 'Space Mono',monospace", fontWeight: "700", letterSpacing: "3px" }}>APPLICATION ONLY</span>
            <span style={{ font: "11px 'Space Mono',monospace", letterSpacing: "1.5px", color: "rgba(247,241,227,.8)" }}>(€8,500 ／ PERSON)</span>
          </div>
          <p style={{ margin: "16px 0 0", fontSize: "16px", lineHeight: "1.7", color: "rgba(247,241,227,.88)" }}><br />Pricing is confirmed individually following a short application review. To maintain a strong participant mix and a high-quality experience, our team will first speak with each applicant to understand their background and areas of interest before confirming participation and sharing the final fee.</p>
          <p style={{ margin: "12px 0 0", fontSize: "16px", lineHeight: "1.7", color: "rgba(247,241,227,.88)" }}>Companies, funds, and institutions planning to join as a group are welcome to contact us to discuss a tailored group package based on team size and specific requirements.</p>
          <p style={{ margin: "14px 0 0", fontSize: "13px", lineHeight: "1.7", color: "#e0b04a", fontWeight: "500" }}>* Limited to 20 participants.</p>
        </div>
        <div style={{ width: "116px", height: "116px", flex: "none", border: "1.5px solid #16305c", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", font: "11px 'Space Mono',monospace", letterSpacing: "2px", color: "#16305c" }}>VERIFIED</div>
      </div>
      <div style={{ marginTop: "34px", background: "#f7f1e3", borderRadius: "16px", padding: "20px 24px 26px", boxShadow: "11px 11px 0 #c8952b", width: "647px", height: "186px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <span style={{ font: "11px 'Space Mono',monospace", letterSpacing: "1px", color: "#fff", background: "#16305c", padding: "4px 9px", borderRadius: "5px" }}>4.2</span>
          <span style={{ fontFamily: "Spectral,serif", fontSize: "17px", fontWeight: "600" }}>What Is Included</span>
        </div>
        <div style={{ marginTop: "18px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 34px" }}>
          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}><span style={{ flex: "none", width: "17px", height: "17px", borderRadius: "50%", background: "#4cae5a", color: "#fff", fontSize: "10px", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "2px" }}>✓</span><span style={{ fontSize: "12.5px", fontWeight: "500", lineHeight: "1.45" }}>Company &amp; Institutional Visits</span></div>
          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}><span style={{ flex: "none", width: "17px", height: "17px", borderRadius: "50%", background: "#4cae5a", color: "#fff", fontSize: "10px", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "2px" }}>✓</span><span style={{ fontSize: "12.5px", fontWeight: "500", lineHeight: "1.45" }}>Briefings, Founder Showcases &amp; Roundtables</span></div>
          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}><span style={{ flex: "none", width: "17px", height: "17px", borderRadius: "50%", background: "#4cae5a", color: "#fff", fontSize: "10px", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "2px" }}>✓</span><span style={{ fontSize: "12.5px", fontWeight: "500", lineHeight: "1.45" }}>Shared Accommodation</span></div>
          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}><span style={{ flex: "none", width: "17px", height: "17px", borderRadius: "50%", background: "#4cae5a", color: "#fff", fontSize: "10px", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "2px" }}>✓</span><span style={{ fontSize: "12.5px", fontWeight: "500", lineHeight: "1.45" }}>Program Transportation &amp; Airport Transfers</span></div>
          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}><span style={{ flex: "0 0 auto", width: "17px", height: "17px", borderRadius: "50%", background: "rgb(76, 174, 90)", color: "rgb(255, 255, 255)", fontSize: "10px", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "2px" }}>✓</span><span style={{ fontSize: "12.5px", fontWeight: "500", lineHeight: "1.45" }}>Group Meals &amp; Hosted Dinners</span></div>
          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}><span style={{ flex: "none", width: "17px", height: "17px", borderRadius: "50%", background: "#4cae5a", color: "#fff", fontSize: "10px", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "2px" }}>✓</span><span style={{ fontSize: "12.5px", fontWeight: "500", lineHeight: "1.45" }}>Chinese–English Interpretation</span></div>
          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}><span style={{ flex: "none", width: "17px", height: "17px", borderRadius: "50%", background: "#4cae5a", color: "#fff", fontSize: "10px", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "2px" }}>✓</span><span style={{ fontSize: "12.5px", fontWeight: "500", lineHeight: "1.45" }}>On-Site Support</span></div>
        </div>
      </div>
      </section><section className="dossier-section" data-screen-label="17" style={{ padding: "0 0 54px", display: "flex", flexDirection: "column", fontFamily: "'Noto Sans SC',sans-serif", color: "#16305c" }}>
      <div style={{ marginTop: "24px", background: "#f7f1e3", borderRadius: "16px", padding: "20px 24px 26px", boxShadow: "11px 11px 0 #c8952b", width: "655px", height: "164px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <span style={{ font: "11px 'Space Mono',monospace", letterSpacing: "1px", color: "#fff", background: "#16305c", padding: "4px 9px", borderRadius: "5px" }}>4.3</span>
          <span style={{ fontFamily: "Spectral,serif", fontSize: "17px", fontWeight: "600" }}>Application Process</span>
        </div>
        <p style={{ margin: "12px 0 0", fontSize: "13px", lineHeight: "1.7", color: "#2b3d5c" }}>Applicants provide a short background, details of their current work, and the questions they hope to explore.</p>
        <div style={{ marginTop: "22px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "6px" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", width: "104px" }}>
            <span style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#16305c", color: "#e0b04a", font: "13px 'Space Mono',monospace", display: "flex", alignItems: "center", justifyContent: "center" }}>1</span>
            <span style={{ fontSize: "11.5px", fontWeight: "500", textAlign: "center", lineHeight: "1.35" }}>Get in Touch</span>
          </div>
          <span style={{ color: "#c8952b", fontSize: "14px", marginTop: "9px" }}>→</span>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", width: "104px" }}>
            <span style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#16305c", color: "#e0b04a", font: "13px 'Space Mono',monospace", display: "flex", alignItems: "center", justifyContent: "center" }}>2</span>
            <span style={{ fontSize: "11.5px", fontWeight: "500", textAlign: "center", lineHeight: "1.35" }}>Introductory Call &amp; Fit Review</span>
          </div>
          <span style={{ color: "#c8952b", fontSize: "14px", marginTop: "9px" }}>→</span>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", width: "104px" }}>
            <span style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#16305c", color: "#e0b04a", font: "13px 'Space Mono',monospace", display: "flex", alignItems: "center", justifyContent: "center" }}>3</span>
            <span style={{ fontSize: "11.5px", fontWeight: "500", textAlign: "center", lineHeight: "1.35" }}>Confirm Your Place</span>
          </div>
          <span style={{ color: "#c8952b", fontSize: "14px", marginTop: "9px" }}>→</span>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", width: "104px" }}>
            <span style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#16305c", color: "#e0b04a", font: "13px 'Space Mono',monospace", display: "flex", alignItems: "center", justifyContent: "center" }}>4</span>
            <span style={{ fontSize: "11.5px", fontWeight: "500", textAlign: "center", lineHeight: "1.35" }}>Agreement &amp; Payment</span>
          </div>
          <span style={{ color: "#c8952b", fontSize: "14px", marginTop: "9px" }}>→</span>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", width: "104px" }}>
            <span style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#e0b04a", color: "#16305c", font: "13px 'Space Mono',monospace", display: "flex", alignItems: "center", justifyContent: "center" }}>5</span>
            <span style={{ fontSize: "11.5px", fontWeight: "500", textAlign: "center", lineHeight: "1.35" }}>Pre-Departure Preparation</span>
          </div>
        </div>
      </div><div style={{ marginTop: "32px", background: "#16305c", borderRadius: "18px", padding: "26px 28px 30px", color: "#f7f1e3", width: "656px", height: "522px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ display: "block", width: "18px", height: "2px", background: "#e0b04a" }}></span>
          <span style={{ font: "12px 'Space Mono',monospace", letterSpacing: "3px", color: "#e0b04a" }}>5 / LOGISTICS AND ACCOMMODATION</span>
        </div>
        <h2 style={{ margin: "14px 0 0", fontFamily: "Spectral,serif", fontSize: "22px", fontWeight: "600", textTransform: "uppercase" }}>Supported from arrival to departure</h2>
        <div style={{ marginTop: "22px", display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ background: "#1c3d6e", borderRadius: "14px", padding: "16px 20px 20px", width: "617px", height: "161px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <span style={{ font: "11px 'Space Mono',monospace", letterSpacing: "1px", color: "#16305c", background: "#e0b04a", padding: "4px 9px", borderRadius: "5px" }}>5.1</span>
              <span style={{ fontFamily: "Spectral,serif", fontSize: "16px", fontWeight: "600" }}>Shanghai Base and Accommodation</span>
            </div>
            <p style={{ margin: "12px 0 0", fontSize: "13px", lineHeight: "1.7", color: "rgba(247,241,227,.88)" }}>Fuxing Island will be the shared base for the Shanghai program, and accommodation is included. We recommend staying with the group because many of the most valuable connections grow outside the formal visits, during shared travel and evening conversations. Participants who prefer a different hotel or an upgraded room can discuss this with the team in advance, though joining the shared arrangement is strongly recommended. Daily transport details will be shared through the program group.</p>
          </div>
          <div style={{ background: "#1c3d6e", borderRadius: "14px", padding: "16px 20px 20px", width: "613px", height: "69px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <span style={{ font: "11px 'Space Mono',monospace", letterSpacing: "1px", color: "#16305c", background: "#e0b04a", padding: "4px 9px", borderRadius: "5px" }}>5.2</span>
              <span style={{ fontFamily: "Spectral,serif", fontSize: "16px", fontWeight: "600" }}>Transport, Meals and Language Support</span>
            </div>
            <p style={{ margin: "12px 0 0", fontSize: "13px", lineHeight: "1.7", color: "rgba(247,241,227,.88)" }}>Airport transfers, local transportation, group meals, hosted dinners, and cultural activities are included. Chinese–English interpretation will be available during key visits and discussions.</p>
          </div>
        </div>
        <div style={{ marginTop: "24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px" }}>
          <span style={{ fontFamily: "Spectral,serif", fontStyle: "italic", fontSize: "16px", color: "#e0b04a" }}>A bridge is worth what crosses it.</span>
          <span style={{ width: "76px", height: "76px", flex: "none", borderRadius: "50%", background: "#e0b04a", color: "#16305c", font: "12px 'Space Mono',monospace", letterSpacing: "2px", display: "flex", alignItems: "center", justifyContent: "center" }}>SENT</span>
        </div>
      </div>
      
      </section>
    
    <footer className="dossier-running-footer" style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", font: "10px 'Space Mono',monospace", letterSpacing: "2px", color: "#8d94a3", paddingTop: "12px" }}><span>THE ARCH — WEEK 1</span><span style={{ fontFamily: "Spectral,serif", fontStyle: "italic", letterSpacing: "0", fontSize: "11px" }}>A bridge is worth what crosses it.</span><span style={{ textAlign: "right" }}>THEARCH.GLOBAL</span></footer>
    </article>
  );
}
