// Mirrors the `.doc` typographic styles from the Contract Generator tool
// (client/public/contract-generator.html) so the stored documentHtml — the
// tool's own rendered output — looks right here too, scoped under
// `.hu-contract-doc` so it can't leak into the rest of the admin panel.
export const docStyles = `
.hu-contract-doc{--brand:#0d6b63;--brand-ink:#095049;--accent:#b4531f;--font:-apple-system,BlinkMacSystemFont,"Segoe UI",Inter,Roboto,Helvetica,Arial,sans-serif}
.hu-contract-doc .doc{font-family:Georgia,"Times New Roman",Times,serif;font-size:11pt;line-height:1.52;color:#1a1a1a}
.hu-contract-doc .doc .lh{display:flex;align-items:flex-end;justify-content:space-between;gap:20px;border-bottom:2px solid var(--brand);padding-bottom:12px;margin-bottom:24px}
.hu-contract-doc .doc .lh.haslogo{border-bottom:1.5px solid #FE0000}
.hu-contract-doc .doc .lh-l{font-family:inherit;text-align:left}
.hu-contract-doc .doc .lh.haslogo .lh-l{text-align:right}
.hu-contract-doc .doc .lh-l b{display:block;font-size:15pt;font-weight:640;color:var(--brand-ink);letter-spacing:-.01em}
.hu-contract-doc .doc .lh.haslogo .lh-l b{font-size:1em;font-weight:600;color:#5b6172;letter-spacing:0}
.hu-contract-doc .doc .lh-l span{display:block;font-size:8.5pt;color:#5b6172;margin-top:3px;letter-spacing:.02em}
.hu-contract-doc .doc .lh img{max-height:58px;max-width:230px;object-fit:contain;flex:0 0 auto}
.hu-contract-doc .doc p{margin:0 0 11px}
.hu-contract-doc .doc .date{margin-bottom:16px}
.hu-contract-doc .doc .conf{font-weight:700;letter-spacing:.04em;font-size:9.5pt;text-transform:uppercase;margin-bottom:14px;color:#444}
.hu-contract-doc .doc .addr{margin-bottom:18px;line-height:1.4}
.hu-contract-doc .doc .addr div{margin:0}
.hu-contract-doc .doc h2.subj{font-size:12pt;font-weight:700;margin:16px 0 12px}
.hu-contract-doc .doc table.det{width:100%;border-collapse:collapse;margin:14px 0 18px;font-size:10pt}
.hu-contract-doc .doc table.det th,.hu-contract-doc .doc table.det td{border:1px solid #b9bec9;padding:7px 9px;vertical-align:top;text-align:left}
.hu-contract-doc .doc table.det th{width:31%;background:#f2f6f6;font-weight:650}
.hu-contract-doc .doc table.det td p{margin:0 0 6px}
.hu-contract-doc .doc table.det td p:last-child{margin:0}
.hu-contract-doc .doc h3.tc{font-size:11.5pt;font-weight:700;text-align:center;margin:26px 0 14px;text-transform:uppercase;letter-spacing:.04em}
.hu-contract-doc .doc ol.cl{padding-left:0;margin:0;counter-reset:cl;list-style:none}
.hu-contract-doc .doc ol.cl>li{counter-increment:cl;margin:0 0 13px;padding-left:26px;position:relative}
.hu-contract-doc .doc ol.cl>li::before{content:counter(cl) ".";position:absolute;left:0;top:0;font-weight:700}
.hu-contract-doc .doc ol.cl>li>b.ct{display:block;font-weight:700;margin-bottom:4px}
.hu-contract-doc .doc ul.sub{margin:7px 0 0;padding-left:19px}
.hu-contract-doc .doc ul.sub li{margin-bottom:5px}
.hu-contract-doc .doc ol.sub{margin:7px 0 0;padding-left:22px}
.hu-contract-doc .doc ol.sub li{margin-bottom:5px}
.hu-contract-doc .doc .sig{margin-top:26px;border-top:1px solid #c6cbd4;padding-top:16px}
.hu-contract-doc .doc .sig h4{font-size:11pt;font-weight:700;margin-bottom:10px}
.hu-contract-doc .doc .sigline{margin:16px 0 0;display:flex;gap:10px;align-items:flex-end}
.hu-contract-doc .doc .sigline span{font-weight:600;min-width:96px}
.hu-contract-doc .doc .sigline i{flex:1;border-bottom:1px solid #6b7280;height:15px;display:block}
.hu-contract-doc .doc .sigline img.sigimg{flex:1;max-height:44px;border-bottom:1px solid #6b7280;object-fit:contain;object-position:left bottom}
.hu-contract-doc .doc .fill{border-bottom:1px solid #6b7280;display:inline-block;min-width:190px}
.hu-contract-doc .doc .ftr{margin-top:28px;padding-top:9px;border-top:1px solid #d7dbe2;font-family:var(--font);font-size:8pt;color:#7a8090;display:flex;justify-content:space-between}
.hu-contract-doc .doc .ph{background:#fdf1e8;border-bottom:1px dashed var(--accent);color:var(--accent);padding:0 2px;border-radius:2px;font-style:italic}
`;
