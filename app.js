/* PortAsset CMMS: static interactive discussion prototype. All mutations remain local to this browser. */
(() => {
'use strict';
const KEY='portasset.cmms.demo.publicsafe.v1.4';
const PREVIOUS_KEY='portasset.cmms.demo.publicsafe.v1.3';
// Public demo: the visible business code is an asset code, not the old internal HGT/SP ID.
// Existing component IDs remain unchanged so historical links and costs cannot break.
// Sample spare assets get distinct SIM-DP codes; serial remains the immutable physical identifier.
const LEGACY_COMPONENT_CODES={
 'HGT-001':'SIM01.02.1', 'HGT-002':'SIM01.02.7',
 'HGT-003':'SIM01.04.1', 'HGT-004':'SIM01.05.1',
 'HGT-005':'SIM-DP.HGT.005', 'HGT-006':'SIM-DP.HGT.006',
 'HGT-007':'SIM-DP.HGT.007', 'HGT-008':'SIM-DP.HGT.008',
 'SP-001':'SIM01.03', 'SP-002':'SIM-DP.SP.002',
 'SP-003':'SIM-DP.SP.003', 'SP-004':'SIM-DP.SP.004'
};
// For legacy demo narratives only: do not overwrite the user's stored notes, WO titles or JSON exports.
function publicNarrative(value){return String(value??'').replace(/(?<![\w-])(?:HGT-\d{3}|SP-\d{3})\b/g,old=>LEGACY_COMPONENT_CODES[old]||old)}
function unitCode(id){let c=comp(id);return c?.code||LEGACY_COMPONENT_CODES[id]||String(id||'—')}
function migratePublicAssetCodes(data){
 let changed=false;
 for(const c of data.components){
  const publicCode=LEGACY_COMPONENT_CODES[c.id];
  if(publicCode&&(!c.code||c.code===c.id||/^HGT-\d{3}$|^SP-\d{3}$/.test(c.code))){
   if(c.code!==publicCode){c.code=publicCode;changed=true}
  }
 }
 if(data.publicAssetCodesVersion!==1){data.publicAssetCodesVersion=1;changed=true}
 return changed;
}

// Isolate this Public Safe demo from any older browser data containing identifiable records.
try { localStorage.removeItem('portasset.cmms.demo.v1'); } catch {}
const ICONS={
 crane:'<path d="M4 21h16M6 21V4h12v17M4 7h16M8 4l5 3M18 7l4 3M13 7v11M10 18h6M4 11h16"/>',
 asset:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
 box:'<path d="m12 2 9 5-9 5-9-5 9-5ZM3 7v10l9 5 9-5V7M12 12v10"/>',
 layers:'<path d="m12 2 9 5-9 5-9-5 9-5ZM3 12l9 5 9-5M3 17l9 5 9-5"/>',
 gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.8 2.8-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1.3 1.6V21h-4v-.1A1.7 1.7 0 0 0 8.4 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.8-2.8.06-.06A1.7 1.7 0 0 0 4.6 15 1.7 1.7 0 0 0 3 13.7H3v-4h.1A1.7 1.7 0 0 0 4.6 8.4a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.8-2.8.06.06A1.7 1.7 0 0 0 9 4.6 1.7 1.7 0 0 0 10.3 3H14a1.7 1.7 0 0 0 1.3 1.6 1.7 1.7 0 0 0 1.88-.34l.06-.06 2.8 2.8-.06.06A1.7 1.7 0 0 0 19.4 9 1.7 1.7 0 0 0 21 10.3V14a1.7 1.7 0 0 0-1.6 1Z"/>',
 wrench:'<path d="M14.7 6.3a6 6 0 0 0-7.9 7.9L3 17.1 6.9 21l3.8-3.8a6 6 0 0 0 7.9-7.9L14 14l-4-4z"/>',
 history:'<path d="M3 12a9 9 0 1 0 2.5-6.2L3 8M3 3v5h5M12 7v5l3 2"/>',
 move:'<path d="M5 4v16M3 6l2-2 2 2M3 18l2 2 2-2M19 4v16M17 6l2-2 2 2M17 18l2 2 2-2M9 8h6M9 16h6"/>',
 clipboard:'<rect x="5" y="4" width="14" height="18" rx="2"/><path d="M9 4.5V3h6v1.5M9 10h6M9 14h6M9 18h4"/>',
 chart:'<path d="M3 3v18h18M7 16v-5M12 16V6M17 16v-8"/>',
 photo:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8" cy="8" r="1.5"/><path d="m3 17 5-5 4 3 4-5 5 7"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 search:'<circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/>',
 close:'<path d="M5 5l14 14M19 5 5 19"/>',
 edit:'<path d="M12 20h9M16.5 3.5l4 4L9 19l-5 1 1-5z"/>',
 check:'<path d="m4 12 5 5L20 6"/>',
 down:'<path d="m6 9 6 6 6-6"/>',
 up:'<path d="m6 15 6-6 6 6"/>',
 link:'<path d="M10 13a5 5 0 0 0 7.4.5l3-3A5 5 0 1 0 13 3l-1.7 1.7M14 11a5 5 0 0 0-7.4-.5l-3 3A5 5 0 1 0 11 21l1.7-1.7"/>',
 save:'<path d="M4 3h14l3 3v15H3V3zM7 3v7h10V3M7 21v-8h10v8"/>',
 upload:'<path d="M12 16V3m-5 5 5-5 5 5M4 17v4h16v-4"/>',
 download:'<path d="M12 3v13m-5-5 5 5 5-5M4 17v4h16v-4"/>',
 reset:'<path d="M3 8v5h5M4 13a8 8 0 1 0 2-7"/>',
 filter:'<path d="M3 4h18l-7 8v6l-4 2v-8z"/>',
 cash:'<circle cx="12" cy="12" r="9"/><path d="M15 8c-1-2-6-2-6 1 0 4 6 1 6 5 0 3-5 4-6 1M12 5v14"/>',
 calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/>',
 pin:'<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
 info:'<circle cx="12" cy="12" r="10"/><path d="M12 11v6M12 7h.01"/>',
 eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
 suitcase:'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M9 7V4h6v3M3 13h18"/>'
};
function icon(k,sz=17){return `<svg class="icon" width="${sz}" height="${sz}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[k]||ICONS.box}</svg>`}
function e(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
const n=(id,code,name,parentId,extras={})=>({id,code,name,parentId,notes:'',...extras});
// Spare demo units: synthetic records, independent of the original crane dataset.
const EXTRA_DEMO_SPARES=[
 {id:'HGT-005',code:'HGT-005',name:'Hộp giảm tốc dự phòng A',kind:'gearbox',serial:'SN-DEMO-HGT-005',model:'DEMO-GB-A',maker:'Hãng thiết bị Demo',year:'',locationId:null,place:'Kho kỹ thuật',status:'warehouse',condition:'Sẵn sàng',notes:'Thiết bị dự phòng giả lập để thử thay thế.'},
 {id:'HGT-007',code:'HGT-007',name:'Hộp giảm tốc dự phòng B',kind:'gearbox',serial:'SN-DEMO-HGT-007',model:'DEMO-GB-B',maker:'Hãng thiết bị Demo',year:'',locationId:null,place:'Kho kỹ thuật',status:'warehouse',condition:'Sẵn sàng',notes:'Thiết bị dự phòng giả lập để thử thay thế.'},
 {id:'HGT-008',code:'HGT-008',name:'Hộp giảm tốc dự phòng C',kind:'gearbox',serial:'SN-DEMO-HGT-008',model:'DEMO-GB-C',maker:'Hãng thiết bị Demo',year:'',locationId:null,place:'Kho kỹ thuật',status:'warehouse',condition:'Sẵn sàng',notes:'Thiết bị dự phòng giả lập để thử thay thế.'},
 {id:'SP-003',code:'SP-003',name:'Khung chụp dự phòng A',kind:'spreader',serial:'SN-DEMO-SP-003',model:'20–40 ft',maker:'Hãng thiết bị Demo',year:'',locationId:null,place:'Kho kỹ thuật',status:'warehouse',condition:'Sẵn sàng',notes:'Khung chụp dự phòng giả lập.'},
 {id:'SP-004',code:'SP-004',name:'Khung chụp dự phòng B',kind:'spreader',serial:'SN-DEMO-SP-004',model:'20–40 ft',maker:'Hãng thiết bị Demo',year:'',locationId:null,place:'Kho kỹ thuật',status:'warehouse',condition:'Sẵn sàng',notes:'Khung chụp dự phòng giả lập.'}
];
function seed(){
 const locations=[
 n('crane','CRANE-001','Cẩu Demo 01',null,{kind:'crane',model:'CR-SIM-2020',serial:'SN-SIM-CR-0001',maker:'Hãng thiết bị Demo',manufactureYear:'2020',inService:'2021-01-01',owner:'Đơn vị Khai thác Cảng Demo',manager:'Tổ Bảo trì Demo',site:'Cảng Mẫu / Khu A / Vị trí 01',registration:'SIM-N/A',notes:'THÔNG TIN GIẢ LẬP — không phản ánh cẩu thực tế'}),
 n('SIM01.01','SIM01.01','Di chuyển xe tời','crane'),
 n('SIM01.02','SIM01.02','Cơ cấu nâng hạ hàng','crane'),
 n('SIM01.03','SIM01.03','Khung chụp','crane',{kind:'spreader-slot'}),
 n('SIM01.04','SIM01.04','Di chuyển cẩu','crane'),
 n('SIM01.05','SIM01.05','Cơ cấu nâng hạ dầm biên','crane'),
 n('SIM01.06','SIM01.06','Cabin điều khiển','crane'),
 n('SIM01.07','SIM01.07','Tang quấn cáp điện nguồn','crane'),
 n('SIM01.08','SIM01.08','Nhà biến áp','crane'),
 n('SIM01.09','SIM01.09','Nhà điện','crane'),
 n('SIM01.01.5','SIM01.01.5','Bánh xe','SIM01.01'),n('SIM01.01.1','SIM01.01.1','Hộp giảm tốc','SIM01.01',{kind:'gearbox-slot'}),n('SIM01.01.2','SIM01.01.2','Motor','SIM01.01'),n('SIM01.01.4','SIM01.01.4','Trục bánh xe','SIM01.01'),n('SIM01.01.3','SIM01.01.3','Vai','SIM01.01'),
 n('SIM01.02.3','SIM01.02.3','Hộp chữ T','SIM01.02'),n('SIM01.02.7','SIM01.02.7','Hộp giảm tốc list/skew','SIM01.02',{kind:'gearbox-slot'}),n('SIM01.02.1','SIM01.02.1','Hộp giảm tốc tời hàng','SIM01.02',{kind:'gearbox-slot'}),n('SIM01.02.2','SIM01.02.2','Khớp nối từ','SIM01.02'),n('SIM01.02.4','SIM01.02.4','Motor','SIM01.02'),n('SIM01.02.6','SIM01.02.6','Phanh sự cố','SIM01.02'),n('SIM01.02.5','SIM01.02.5','Phanh thường trực','SIM01.02'),
 n('SIM01.03.1','SIM01.03.1','Dây đai ra vào 20-40','SIM01.03'),
 n('SIM01.04.1','SIM01.04.1','Hộp giảm tốc','SIM01.04',{kind:'gearbox-slot'}),n('SIM01.04.3','SIM01.04.3','Kẹp ray','SIM01.04'),n('SIM01.04.2','SIM01.04.2','Motor','SIM01.04'),
 n('SIM01.05.2','SIM01.05.2','Hộp chữ T','SIM01.05'),n('SIM01.05.1','SIM01.05.1','Hộp giảm tốc','SIM01.05',{kind:'gearbox-slot'}),n('SIM01.05.3','SIM01.05.3','Motor','SIM01.05'),n('SIM01.05.5','SIM01.05.5','Phanh sự cố','SIM01.05'),n('SIM01.05.4','SIM01.05.4','Phanh thường trực','SIM01.05')];
 const components=[
 {id:'HGT-001',code:'HGT-001',name:'Hộp giảm tốc tời hàng số 01',kind:'gearbox',serial:'SN-SIM-HGT-001',model:'MODEL-MẪU-01',maker:'Hãng thiết bị Demo',year:'',locationId:'SIM01.02.1',place:'Cẩu Demo 01 / SIM01.02.1',status:'installed',condition:'Đạt',notes:'Thiết bị vật lý có hồ sơ riêng; có thể tháo/lắp hoán đổi.'},
 {id:'HGT-002',code:'HGT-002',name:'Hộp giảm tốc list/skew',kind:'gearbox',serial:'SN-SIM-HGT-002',model:'',maker:'',year:'',locationId:'SIM01.02.7',place:'Cẩu Demo 01 / SIM01.02.7',status:'installed',condition:'Đạt',notes:''},
 {id:'HGT-003',code:'HGT-003',name:'Hộp giảm tốc di chuyển cẩu',kind:'gearbox',serial:'SN-SIM-HGT-003',model:'',maker:'',year:'',locationId:'SIM01.04.1',place:'Cẩu Demo 01 / SIM01.04.1',status:'installed',condition:'Đạt',notes:''},
 {id:'HGT-004',code:'HGT-004',name:'Hộp giảm tốc dầm biên',kind:'gearbox',serial:'SN-SIM-HGT-004',model:'',maker:'',year:'',locationId:'SIM01.05.1',place:'Cẩu Demo 01 / SIM01.05.1',status:'installed',condition:'Đạt',notes:''},
 {id:'HGT-006',code:'HGT-006',name:'Hộp giảm tốc dự phòng',kind:'gearbox',serial:'SN-DEMO-HGT-006',model:'',maker:'',year:'',locationId:null,place:'Kho kỹ thuật',status:'warehouse',condition:'Sẵn sàng',notes:'Đã thay thế tạm HGT-001 trong kỳ sửa chữa tháng 9/2026.'},
 {id:'SP-001',code:'SP-001',name:'Khung chụp (Spreader) chính',kind:'spreader',serial:'SN-DEMO-SP-001',model:'20–40 ft',maker:'',year:'',locationId:'SIM01.03',place:'Cẩu Demo 01 / SIM01.03',status:'installed',condition:'Đạt',notes:'Ví dụ thiết bị có thể tháo để hàn, bảo dưỡng.'},
 {id:'SP-002',code:'SP-002',name:'Khung chụp (Spreader) dự phòng',kind:'spreader',serial:'SN-DEMO-SP-002',model:'20–40 ft',maker:'',year:'',locationId:null,place:'Đơn vị sửa chữa nước ngoài',status:'repair',condition:'Đang sửa chữa',notes:'Minh họa trường hợp gửi sửa chữa nước ngoài.'}];
 components.push(...EXTRA_DEMO_SPARES.map(x=>({...x})));
 const ev=(id,componentId,type,date,note='',extra={})=>({id,componentId,type,date,note,...extra});
 const events=[
 ev('E001','HGT-001','install','2024-01-15T09:00','Lắp ban đầu tại vị trí tời hàng',{toLoc:'SIM01.02.1'}),
 ev('E002','HGT-001','remove','2026-09-12T08:00','Tháo kiểm tra, gửi sửa chữa',{fromLoc:'SIM01.02.1',place:'Kho kỹ thuật'}),
 ev('E003','HGT-006','install','2026-09-12T09:00','Lắp thay thế tạm trong thời gian HGT-001 sửa chữa',{toLoc:'SIM01.02.1'}),
 ev('E004','HGT-001','send','2026-09-14T08:30','Bảo dưỡng, thay dầu',{place:'Xưởng nội bộ'}),
 ev('E005','HGT-001','complete','2026-09-28T16:00','Nghiệm thu đạt, đưa về kho',{place:'Kho kỹ thuật'}),
 ev('E006','HGT-006','remove','2026-09-30T08:00','Tháo hộp giảm tốc thay thế tạm',{fromLoc:'SIM01.02.1',place:'Kho kỹ thuật'}),
 ev('E007','HGT-001','install','2026-09-30T10:00','Lắp lại sau bảo dưỡng',{toLoc:'SIM01.02.1'}),
 ev('E008','HGT-002','install','2025-03-01T10:00','Lắp đặt',{toLoc:'SIM01.02.7'}),
 ev('E009','HGT-003','install','2024-02-01T09:00','Lắp đặt',{toLoc:'SIM01.04.1'}),
 ev('E010','HGT-004','install','2024-02-02T09:00','Lắp đặt',{toLoc:'SIM01.05.1'}),
 ev('E011','SP-001','install','2025-06-01T09:00','Lắp vào cẩu Demo 01',{toLoc:'SIM01.03'}),
  ev('E012','SP-002','send','2026-10-02T09:00','Gửi sửa chữa, hàn kết cấu',{place:'Đơn vị sửa chữa nước ngoài'}),
  ev('E013','HGT-002','remove','2026-05-15T08:30','Tháo kiểm tra rò dầu',{fromLoc:'SIM01.02.7',place:'Kho kỹ thuật',woId:'WO-DEMO-2026-0120'}),
  ev('E014','HGT-002','send','2026-05-16T09:00','Gửi xưởng xử lý phớt',{place:'Xưởng nội bộ',woId:'WO-DEMO-2026-0120'}),
  ev('E015','HGT-002','complete','2026-05-29T15:00','Kiểm tra đạt, nhập kho',{place:'Kho kỹ thuật',woId:'WO-DEMO-2026-0120'}),
  ev('E016','HGT-002','install','2026-06-01T08:00','Lắp trở lại vị trí list/skew',{toLoc:'SIM01.02.7',woId:'WO-DEMO-2026-0120'}),
  ev('E017','HGT-003','remove','2025-07-10T08:00','Tháo sửa chữa bánh răng',{fromLoc:'SIM01.04.1',place:'Kho kỹ thuật',woId:'WO-DEMO-2025-0200'}),
  ev('E018','HGT-003','send','2025-07-12T09:00','Gửi đơn vị trong nước',{place:'Đơn vị sửa chữa trong nước',woId:'WO-DEMO-2025-0200'}),
  ev('E019','HGT-003','complete','2025-08-08T14:00','Nghiệm thu thử tải đạt',{place:'Kho kỹ thuật',woId:'WO-DEMO-2025-0200'}),
  ev('E020','HGT-003','install','2025-08-10T08:30','Lắp sau sửa chữa',{toLoc:'SIM01.04.1',woId:'WO-DEMO-2025-0200'}),
  ev('E021','HGT-004','remove','2026-08-02T07:45','Tháo bảo dưỡng định kỳ',{fromLoc:'SIM01.05.1',place:'Kho kỹ thuật',woId:'WO-DEMO-2026-0230'}),
  ev('E022','HGT-004','send','2026-08-03T10:00','Chuyển xưởng bảo dưỡng',{place:'Xưởng nội bộ',woId:'WO-DEMO-2026-0230'}),
  ev('E023','HGT-004','complete','2026-08-09T16:00','Hoàn thành bảo dưỡng',{place:'Kho kỹ thuật',woId:'WO-DEMO-2026-0230'}),
  ev('E024','HGT-004','install','2026-08-10T09:30','Lắp sau bảo dưỡng',{toLoc:'SIM01.05.1',woId:'WO-DEMO-2026-0230'}),
  ev('E025','SP-001','remove','2026-01-01T08:00','Tháo đưa đi hàn phục hồi',{fromLoc:'SIM01.03',place:'Kho kỹ thuật',woId:'WO-DEMO-2026-0008'}),
  ev('E026','SP-001','send','2026-01-02T11:00','Hàn kết cấu và kiểm tra khóa gù',{place:'Xưởng nội bộ',woId:'WO-DEMO-2026-0008'}),
  ev('E027','SP-001','complete','2026-01-12T15:30','Hoàn tất kiểm tra không phá hủy',{place:'Kho kỹ thuật',woId:'WO-DEMO-2026-0008'}),
  ev('E028','SP-001','install','2026-01-20T08:00','Lắp khung chụp chính trở lại',{toLoc:'SIM01.03',woId:'WO-DEMO-2026-0008'}),
  ev('E029','SP-002','install','2026-01-05T08:00','Lắp khung chụp dự phòng',{toLoc:'SIM01.03'}),
  ev('E030','SP-002','remove','2026-01-16T15:00','Tháo khung chụp dự phòng',{fromLoc:'SIM01.03',place:'Kho kỹ thuật'})];
 const workorders=[
 {id:'WO-DEMO-2026-0289',code:'WO-DEMO-2026-0289',date:'2026-09-12',title:'Sửa chữa lớn HGT-001',type:'Sửa chữa',componentId:'HGT-001',locationId:'SIM01.02.1',status:'done',description:'Kiểm tra, thay dầu và nghiệm thu tại xưởng nội bộ'},
 {id:'WO-DEMO-2025-0156',code:'WO-DEMO-2025-0156',date:'2025-03-12',title:'Bảo dưỡng định kỳ HGT-001',type:'Bảo dưỡng',componentId:'HGT-001',locationId:'SIM01.02.1',status:'done',description:'Thay dầu, kiểm tra độ rơ'},
 {id:'WO-DEMO-2024-0789',code:'WO-DEMO-2024-0789',date:'2024-06-18',title:'Kiểm tra rung HGT-001',type:'Kiểm tra',componentId:'HGT-001',locationId:'SIM01.02.1',status:'done',description:'Kiểm tra độ rung, độ ồn'},
 {id:'WO-DEMO-2026-0304',code:'WO-DEMO-2026-0304',date:'2026-10-02',title:'Hàn sửa chữa khung chụp SP-002',type:'Sửa chữa',componentId:'SP-002',locationId:'SIM01.03',status:'progress',description:'Đã gửi đơn vị sửa chữa nước ngoài'},
  {id:'WO-DEMO-2026-0312',code:'WO-DEMO-2026-0312',date:'2026-10-08',title:'Kiểm tra hộp giảm tốc di chuyển cẩu',type:'Kiểm tra',componentId:'HGT-003',locationId:'SIM01.04.1',status:'open',description:''},
  {id:'WO-DEMO-2026-0120',code:'WO-DEMO-2026-0120',date:'2026-05-15',title:'Xử lý rò dầu HGT-002',type:'Sửa chữa',componentId:'HGT-002',locationId:'SIM01.02.7',status:'done',description:'Thay phớt, thử kín và nghiệm thu'},
  {id:'WO-DEMO-2025-0200',code:'WO-DEMO-2025-0200',date:'2025-07-10',title:'Sửa chữa bánh răng HGT-003',type:'Sửa chữa',componentId:'HGT-003',locationId:'SIM01.04.1',status:'done',description:'Thuê đơn vị sửa chữa trong nước'},
  {id:'WO-DEMO-2026-0230',code:'WO-DEMO-2026-0230',date:'2026-08-02',title:'Bảo dưỡng HGT-004',type:'Bảo dưỡng',componentId:'HGT-004',locationId:'SIM01.05.1',status:'done',description:'Thay dầu, kiểm tra bạc đạn'},
  {id:'WO-DEMO-2026-0008',code:'WO-DEMO-2026-0008',date:'2026-01-01',title:'Hàn sửa chữa SP-001',type:'Sửa chữa',componentId:'SP-001',locationId:'SIM01.03',status:'done',description:'Hàn phục hồi khung chụp và kiểm tra NDT'}];
 const costs=[
 {id:'C1',date:'2026-09-28',componentId:'HGT-001',woId:'WO-DEMO-2026-0289',locationId:'SIM01.02.1',category:'Sửa chữa',amount:120000000,note:'Đại tu, bảo dưỡng tại xưởng'},
 {id:'C2',date:'2025-03-12',componentId:'HGT-001',woId:'WO-DEMO-2025-0156',locationId:'SIM01.02.1',category:'Bảo dưỡng',amount:40000000,note:'Vật tư, dầu, công sửa chữa'},
 {id:'C3',date:'2024-06-18',componentId:'HGT-001',woId:'WO-DEMO-2024-0789',locationId:'SIM01.02.1',category:'Kiểm tra',amount:12000000,note:'Đo rung, kiểm tra'},
 {id:'C4',date:'2026-10-02',componentId:'SP-002',woId:'WO-DEMO-2026-0304',locationId:'SIM01.03',category:'Sửa chữa',amount:85000000,note:'Tạm ghi nhận chi phí dịch vụ sửa chữa nước ngoài; demo'},
  {id:'C5',date:'2026-03-08',componentId:'HGT-003',woId:'',locationId:'SIM01.04.1',category:'Bảo dưỡng',amount:18000000,note:'Kiểm tra và thay dầu'},
  {id:'C6',date:'2026-05-29',componentId:'HGT-002',woId:'WO-DEMO-2026-0120',locationId:'SIM01.02.7',category:'Sửa chữa',amount:34000000,note:'Thay phớt, kiểm tra độ kín'},
  {id:'C7',date:'2025-08-08',componentId:'HGT-003',woId:'WO-DEMO-2025-0200',locationId:'SIM01.04.1',category:'Sửa chữa',amount:68000000,note:'Sửa chữa bánh răng thuê ngoài'},
  {id:'C8',date:'2026-08-09',componentId:'HGT-004',woId:'WO-DEMO-2026-0230',locationId:'SIM01.05.1',category:'Bảo dưỡng',amount:15500000,note:'Thay dầu và vòng bi'},
  {id:'C9',date:'2026-01-12',componentId:'SP-001',woId:'WO-DEMO-2026-0008',locationId:'SIM01.03',category:'Sửa chữa',amount:42500000,note:'Hàn phục hồi + kiểm tra NDT'},
  {id:'C10',date:'2026-10-04',componentId:'SP-002',woId:'WO-DEMO-2026-0304',locationId:'SIM01.03',category:'Vận chuyển',amount:12500000,note:'Cước vận chuyển thiết bị đi sửa chữa nước ngoài'}];
 return {schema:1,demoSparePackVersion:1,locations,components,events,workorders,costs};
}
let db;
try{db=JSON.parse(localStorage.getItem(KEY)||localStorage.getItem(PREVIOUS_KEY)||'null');if(!db||db.schema!==1||!Array.isArray(db.locations)||!Array.isArray(db.components)||!Array.isArray(db.events)||!Array.isArray(db.workorders)||!Array.isArray(db.costs))db=seed()}catch{db=seed()}
// One-time additive upgrade for users who already tested v1.4.x.
// Do not reset their movements, work orders, costs, or edited existing components.
if(db.demoSparePackVersion!==1){
 const existing=new Set(db.components.map(x=>x.id));
 for(const item of EXTRA_DEMO_SPARES){if(!existing.has(item.id)){db.components.push({...item});existing.add(item.id)}}
 db.demoSparePackVersion=1;
 try{localStorage.setItem(KEY,JSON.stringify(db))}catch{}
}
// Migrate display codes only; never reset or replace the internal event/WO/cost ledger.
if(migratePublicAssetCodes(db)){try{localStorage.setItem(KEY,JSON.stringify(db))}catch{}}

// v1.5.1 – Meter ledger. An operating counter belongs to a physical unit (e.g. Spreader)
// independently from its installation location. Never reset it on removal or transfer.
const METER_KINDS={production:{name:'Sản lượng',unit:'lượt'},hours:{name:'Giờ hoạt động',unit:'giờ'},km:{name:'Quãng đường',unit:'km'}};
function ensureMeters(data){
 let changed=false;
 if(!Array.isArray(data.meterDefs)){data.meterDefs=[];changed=true}
 if(!Array.isArray(data.meterEntries)){data.meterEntries=[];changed=true}
 const addDef=(ownerType,ownerId,kind)=>{
  if(data.meterDefs.some(d=>d.ownerType===ownerType&&d.ownerId===ownerId&&d.kind===kind))return;
  data.meterDefs.push({id:'MDEF-'+ownerType+'-'+ownerId+'-'+kind,ownerType,ownerId,kind});changed=true;
 };
 for(const l of data.locations.filter(x=>x.kind==='crane')){addDef('loc',l.id,'hours');addDef('loc',l.id,'production')}
 for(const c of data.components){
  if(c.kind==='spreader')addDef('cmp',c.id,'production');
  else if(c.kind==='gearbox')addDef('cmp',c.id,'hours');
 }
 // Public, wholly invented values, only on first migration and only for an installed example.
 if(!data.meterVersion&&data.events.length===30&&data.workorders.length===9&&data.costs.length===10&&data.components.some(c=>c.id==='SP-001'&&c.locationId==='SIM01.03')&&!data.meterEntries.some(r=>r.ownerType==='cmp'&&r.ownerId==='SP-001')){
  const def=data.meterDefs.find(d=>d.ownerType==='cmp'&&d.ownerId==='SP-001'&&d.kind==='production');
  if(def){
   const sample=[['2026-02-01T08:00',100000,100000],['2026-07-01T08:00',15000,115000],['2026-10-10T08:00',12000,127000]];
   let old=0;
   for(const [at,delta,total] of sample){
    data.meterEntries.push({id:'MR-DEMO-'+total,defId:def.id,ownerType:'cmp',ownerId:'SP-001',at,previous:old,delta,total,mode:'increment',locationId:'SIM01.03',craneId:'crane',craneCode:'CRANE-001',craneName:'Cẩu Demo 01',note:'Dữ liệu sản lượng giả lập'});old=total;
   }
   changed=true;
  }
 }
 if(data.meterVersion!==1){data.meterVersion=1;changed=true}
 return changed;
}
if(ensureMeters(db)){try{localStorage.setItem(KEY,JSON.stringify(db))}catch{}}
// v1.5.1 – Add four synthetic cranes and complete traceable WO/cost lifecycles.
// Existing browser work stays intact: only insert missing, deterministic demo IDs.
function ensureFiveCraneDemo(data){
 if(data.fiveCraneDemoVersion===1)return false;
 let changed=false;
 const put=(array,row)=>{if(!array.some(x=>x.id===row.id)){array.push(row);changed=true}};
 const shift=(i)=>String(i).padStart(2,'0');
 const sampleGroups=[['01','Di chuyển xe tời'],['02','Cơ cấu nâng hạ hàng'],['03','Khung chụp'],['04','Di chuyển cẩu'],['05','Cơ cấu nâng hạ dầm biên'],['06','Cabin điều khiển'],['07','Tang quấn cáp điện nguồn'],['08','Nhà biến áp'],['09','Nhà điện']];
 const gbSlots=[['01.1','Hộp giảm tốc xe tời'],['02.1','Hộp giảm tốc tời hàng'],['02.7','Hộp giảm tốc list/skew'],['04.1','Hộp giảm tốc di chuyển cẩu'],['05.1','Hộp giảm tốc dầm biên']];
 for(let i=2;i<=5;i++){
  const num=shift(i),root='crane'+i,prefix='SIM'+num,crCode='CRANE-'+String(i).padStart(3,'0'),crName='Cẩu Demo '+num;
  put(data.locations,n(root,crCode,crName,null,{kind:'crane',model:'CR-SIM-'+(2018+i),serial:'SN-DEMO-CR-'+num,maker:'Nhà sản xuất mô phỏng',manufactureYear:String(2018+i),inService:'2021-01-01',owner:'Đơn vị Cảng Demo',manager:'Tổ bảo trì Demo '+num,site:'Cảng Mẫu / Khu '+String.fromCharCode(64+i),registration:'DEMO-'+num,notes:'Cẩu mô phỏng, không thuộc cảng thực tế.'}));
  for(const [suffix,name] of sampleGroups)put(data.locations,n(prefix+'.'+suffix,prefix+'.'+suffix,name,root,{...(suffix==='03'?{kind:'spreader-slot'}:{})}));
  for(const [suffix,name] of gbSlots){
   const id=prefix+'.'+suffix,group=suffix.slice(0,2);
   put(data.locations,n(id,id,name,prefix+'.'+group,{kind:'gearbox-slot'}));
  }
  for(let j=0;j<gbSlots.length;j++){
   const [suffix,name]=gbSlots[j],id='GB-DEMO-'+num+'-'+shift(j+1),loc=prefix+'.'+suffix,wo='WO-DEMO-2026-'+num+'GB'+shift(j+1);
   put(data.components,{id,code:loc,name,kind:'gearbox',serial:'SN-DEMO-'+num+'-GB'+shift(j+1),model:'GB-SIM-'+shift(j+1),maker:'Nhà sản xuất mô phỏng',year:'2020',locationId:loc,place:crName+' / '+loc,status:'installed',condition:'Đạt',notes:'Hộp giảm tốc giả lập có lịch sử sửa chữa, công việc và chi phí.'});
   const earlier='2025-01-'+shift(7+j)+'T08:00';
   put(data.events,{id:'MC-'+num+'-GB'+shift(j+1)+'-I',componentId:id,type:'install',date:earlier,toLoc:loc,note:'Lắp hộp giảm tốc ban đầu (giả lập)',craneId:root,craneCode:crCode,craneName:crName});
   const day=shift(j+4),from='2026-03-'+day,to='2026-03-'+shift(j+5);
   put(data.events,{id:'MC-'+num+'-GB'+shift(j+1)+'-R',componentId:id,type:'remove',date:from+'T08:00',fromLoc:loc,place:'Xưởng nội bộ',note:'Tháo bảo dưỡng hộp giảm tốc',woId:wo,craneId:root,craneCode:crCode,craneName:crName});
   put(data.events,{id:'MC-'+num+'-GB'+shift(j+1)+'-S',componentId:id,type:'send',date:from+'T09:00',place:'Xưởng nội bộ',note:'Gửi kiểm tra, thay dầu và bạc đạn',woId:wo,craneId:root,craneCode:crCode,craneName:crName});
   put(data.events,{id:'MC-'+num+'-GB'+shift(j+1)+'-C',componentId:id,type:'complete',date:to+'T13:00',place:'Kho kỹ thuật',note:'Nghiệm thu sửa chữa đạt',woId:wo,craneId:root,craneCode:crCode,craneName:crName});
   put(data.events,{id:'MC-'+num+'-GB'+shift(j+1)+'-I2',componentId:id,type:'install',date:to+'T16:00',toLoc:loc,note:'Lắp lại sau bảo dưỡng',woId:wo,craneId:root,craneCode:crCode,craneName:crName});
   put(data.workorders,{id:wo,code:wo,date:from,title:'Bảo dưỡng '+name+' - '+crCode,type:'Bảo dưỡng',componentId:id,locationId:loc,status:'done',description:'Tháo, kiểm tra, sửa chữa, nghiệm thu và lắp lại (dữ liệu demo).'});
   put(data.costs,{id:'C-DEMO-'+num+'-GB'+shift(j+1),date:to,componentId:id,woId:wo,locationId:loc,category:'Bảo dưỡng',amount:5500000+i*1400000+j*1250000,note:'Chi phí vật tư, dầu, nhân công mô phỏng, ghi một lần theo WO.'});
  }
  if(i>=3){
   const cId='SP-00'+(i+2),loc=prefix+'.03',wo='WO-DEMO-2026-'+num+'SP01';
   put(data.components,{id:cId,code:loc,name:'Khung chụp Cẩu Demo '+num,kind:'spreader',serial:'SN-DEMO-'+num+'-SP',model:'20–40 ft',maker:'Nhà sản xuất mô phỏng',year:'2021',locationId:loc,place:crName+' / '+loc,status:'installed',condition:'Đạt',notes:'Sản lượng tích lũy đi theo khung chụp.'});
   for(const [typ,dt,extra] of [
    ['install','2025-03-01T08:00',{toLoc:loc,note:'Lắp khung chụp ban đầu'}],
    ['remove','2026-04-01T08:00',{fromLoc:loc,place:'Xưởng nội bộ',note:'Tháo bảo dưỡng khung chụp'}],
    ['send','2026-04-01T09:00',{place:'Xưởng nội bộ',note:'Sửa chữa kết cấu và khóa gù'}],
    ['complete','2026-04-03T14:00',{place:'Kho kỹ thuật',note:'Nghiệm thu đạt'}],
    ['install','2026-04-04T08:00',{toLoc:loc,note:'Lắp trở lại cẩu'}]]){
     const evtId='MC-'+num+'-SP-'+typ+'-'+dt.slice(5,10);
     put(data.events,{id:evtId,componentId:cId,type:typ,date:dt,woId:typ==='install'&&dt.startsWith('2025')?'':wo,craneId:root,craneCode:crCode,craneName:crName,...extra});
   }
   put(data.workorders,{id:wo,code:wo,date:'2026-04-01',title:'Bảo dưỡng khung chụp '+crCode,type:'Bảo dưỡng',componentId:cId,locationId:loc,status:'done',description:'Kiểm tra kết cấu, khóa gù, nghiệm thu.'});
   put(data.costs,{id:'C-DEMO-'+num+'-SP',date:'2026-04-03',componentId:cId,woId:wo,locationId:loc,category:'Sửa chữa',amount:19500000+i*1250000,note:'Sửa chữa khung chụp – chi phí demo.'});
  }
 }
 // Populate a real-looking 2-crane exchange ONLY for untouched public demo records.
 // Never overwrite a user's previously altered SP-001/SP-003 locations or movement ledger.
 const sp1=data.components.find(c=>c.id==='SP-001'),sp3=data.components.find(c=>c.id==='SP-003');
 const demoBase=data.events.filter(v=>/^E0\d+$/.test(v.id)).length===30 &&
     data.meterEntries?.filter(r=>r.ownerId==='SP-001').length===3 &&
     ['100000','115000','127000'].every((v,j)=>String(data.meterEntries.filter(r=>r.ownerId==='SP-001').sort((a,b)=>a.at.localeCompare(b.at))[j]?.total)===v);
 if(demoBase&&sp1?.locationId==='SIM01.03'&&sp3&&!sp3.locationId&&sp3.status==='warehouse'&&
   !data.events.some(x=>x.componentId==='SP-003')){
  const swapEvents=[
   ['SW-001','SP-003','install','2025-03-01T08:00','SIM02.03','Lắp khung chụp dự phòng trên CRANE-002'],
   ['SW-002','SP-001','remove','2026-08-01T08:00','SIM01.03','Tháo khỏi CRANE-001 để đảo chuyển'],
   ['SW-003','SP-003','remove','2026-08-01T09:00','SIM02.03','Tháo khỏi CRANE-002 để đảo chuyển'],
   ['SW-004','SP-001','install','2026-08-02T08:00','SIM02.03','Lắp SP chính sang CRANE-002'],
   ['SW-005','SP-003','install','2026-08-02T09:00','SIM01.03','Lắp SP dự phòng vào CRANE-001'],
   ['SW-006','SP-001','remove','2026-09-10T08:00','SIM02.03','Tháo khỏi CRANE-002 để đảo chuyển trở lại'],
   ['SW-007','SP-003','remove','2026-09-10T09:00','SIM01.03','Tháo khỏi CRANE-001 để đảo chuyển trở lại'],
   ['SW-008','SP-001','install','2026-09-11T08:00','SIM01.03','Lắp lại CRANE-001, giữ nguyên sản lượng tích lũy'],
   ['SW-009','SP-003','install','2026-09-11T09:00','SIM02.03','Lắp lại CRANE-002']
  ];
  for(const [id,cid,type,date,loc,note] of swapEvents){
   const craneId=loc.startsWith('SIM01')?'crane':'crane2',craneCode=craneId==='crane'?'CRANE-001':'CRANE-002',craneName=craneId==='crane'?'Cẩu Demo 01':'Cẩu Demo 02';
   put(data.events,{id,componentId:cid,type,date,note,craneId,craneCode,craneName,...(type==='install'?{toLoc:loc}:{fromLoc:loc,place:'Khu bảo dưỡng'})});
  }
  Object.assign(sp3,{locationId:'SIM02.03',place:'Cẩu Demo 02 / SIM02.03',status:'installed',condition:'Đạt'});
  const def1=data.meterDefs.find(d=>d.ownerType==='cmp'&&d.ownerId==='SP-001'&&d.kind==='production');
  const data1=data.meterEntries.filter(r=>r.ownerId==='SP-001').sort((a,b)=>a.at.localeCompare(b.at));
  if(def1&&data1.length===3){
   for(const [id,at,prev,total] of [
    ['MR-SW-001','2026-08-20T08:00',115000,120000],
    ['MR-SW-002','2026-09-05T08:00',120000,124000]]){
      put(data.meterEntries,{id,defId:def1.id,ownerType:'cmp',ownerId:'SP-001',at,previous:prev,delta:total-prev,total,mode:'increment',locationId:'SIM02.03',craneId:'crane2',craneCode:'CRANE-002',craneName:'Cẩu Demo 02',note:'Sản lượng phát sinh khi lắp CRANE-002'});
   }
   const last=data1[2];last.previous=124000;last.delta=last.total-124000;changed=true;
  }
  const def3=data.meterDefs.find(d=>d.ownerType==='cmp'&&d.ownerId==='SP-003'&&d.kind==='production');
  if(def3){
   const rd=[['2025-07-01T08:00',0,70000,'SIM02.03','crane2','CRANE-002','Cẩu Demo 02'],['2026-07-25T08:00',70000,85000,'SIM02.03','crane2','CRANE-002','Cẩu Demo 02'],['2026-08-18T08:00',85000,91000,'SIM01.03','crane','CRANE-001','Cẩu Demo 01'],['2026-10-12T08:00',91000,106000,'SIM02.03','crane2','CRANE-002','Cẩu Demo 02']];
   rd.forEach(([at,previous,total,locationId,craneId,craneCode,craneName],j)=>put(data.meterEntries,{id:'MR-SW-SP003-'+(j+1),defId:def3.id,ownerType:'cmp',ownerId:'SP-003',at,previous,delta:total-previous,total,mode:'increment',locationId,craneId,craneCode,craneName,note:'Sản lượng tích lũy sau đảo chuyển cẩu'}));
  }
  const wo='WO-DEMO-2026-SWAP01';
  put(data.workorders,{id:wo,code:wo,date:'2026-08-01',title:'Đảo chuyển khung chụp giữa CRANE-001 và CRANE-002',type:'Bảo dưỡng',componentId:'SP-003',locationId:'SIM02.03',status:'done',description:'Tháo/lắp hoán đổi hai khung chụp; sản lượng lũy kế của mỗi SP giữ nguyên.'});
  // Link both physical units to the same WO without duplicating a cost line.
  for(const id of ['SW-002','SW-003','SW-004','SW-005']){const v=data.events.find(x=>x.id===id);if(v){v.woId=wo;changed=true}}
  put(data.costs,{id:'C-DEMO-SWAP01',date:'2026-08-02',componentId:'SP-003',woId:wo,locationId:'SIM02.03',category:'Vận chuyển',amount:4200000,note:'Chi phí đảo chuyển thử nghiệm, ghi một lần trên SP-003.'});
 }
 // All demo spare gearboxes also have their own maintenance work order and cost history.
 // No state changes to a spare that the user has already moved or edited.
 for(const cid of ['HGT-005','HGT-006','HGT-007','HGT-008']){
  const c=data.components.find(x=>x.id===cid);if(!c)continue;
  const suffix=cid.slice(-3),wo='WO-DEMO-2026-SPARE-'+suffix;
  put(data.workorders,{id:wo,code:wo,date:'2026-02-10',title:'Kiểm tra bảo dưỡng '+c.code,type:'Bảo dưỡng',componentId:cid,locationId:cid==='HGT-006'?'SIM01.02.1':null,status:'done',description:'Kiểm tra dầu, độ rơ và hồ sơ sẵn sàng thay thế. Dữ liệu demo.'});
  put(data.costs,{id:'C-DEMO-SPARE-'+suffix,date:'2026-02-12',componentId:cid,woId:wo,locationId:cid==='HGT-006'?'SIM01.02.1':null,category:'Bảo dưỡng',amount:3500000+Number(suffix)*125000,note:'Bảo dưỡng hộp giảm tốc dự phòng – chi phí mẫu.'});
  if(cid!=='HGT-006'&&c.status==='warehouse'&&!c.locationId&&!data.events.some(v=>v.componentId===cid)){
   put(data.events,{id:'MC-SPARE-'+suffix+'-S',componentId:cid,type:'send',date:'2026-02-10T08:00',place:'Xưởng nội bộ',note:'Kiểm tra hộp dự phòng',woId:wo});
   put(data.events,{id:'MC-SPARE-'+suffix+'-C',componentId:cid,type:'complete',date:'2026-02-12T16:00',place:'Kho kỹ thuật',note:'Kiểm tra đạt, đưa về kho dự phòng',woId:wo});
  }
 }
 data.fiveCraneDemoVersion=1;
 return true;
}

if(ensureFiveCraneDemo(db)){ensureMeters(db);try{localStorage.setItem(KEY,JSON.stringify(db))}catch{}}
function ensureOtherSpreaderMeters(data){
 if(data.otherSpreaderMetersVersion===1)return false;
 let changed=false;
 for(let i=3;i<=5;i++){
  const id='SP-00'+(i+2),code='CRANE-'+String(i).padStart(3,'0'),cId='crane'+i,root=data.components.find(c=>c.id===id);
  if(!root)continue;
  const def=data.meterDefs.find(d=>d.ownerType==='cmp'&&d.ownerId===id&&d.kind==='production');
  if(!def||data.meterEntries.some(r=>r.ownerId===id))continue;
  const nums=[45000+i*3000,55000+i*3500,62000+i*3700];
  const times=['2025-07-01T08:00','2026-03-01T08:00','2026-10-10T08:00'];
  nums.forEach((total,j)=>{const prev=j?nums[j-1]:0;data.meterEntries.push({id:'MR-DEMO-'+id+'-'+(j+1),defId:def.id,ownerType:'cmp',ownerId:id,at:times[j],previous:prev,delta:total-prev,total,mode:'increment',locationId:root.locationId,craneId:cId,craneCode:code,craneName:'Cẩu Demo '+String(i).padStart(2,'0'),note:'Sản lượng khung chụp – dữ liệu mô phỏng'});changed=true});
 }
 data.otherSpreaderMetersVersion=1;return true;
}
if(ensureOtherSpreaderMeters(db)){try{localStorage.setItem(KEY,JSON.stringify(db))}catch{}}

const ui={page:'assets',selected:'loc:crane',detail:'info',detailOpen:false,expanded:new Set([]),gridSearch:'',gridLevel:'all',gridStatus:'all',gridPage:1,gridPageSize:20,checked:new Set(),treeSearch:'',partSearch:'',partStatus:'all',partKind:'all',logSearch:'',woSearch:'',reportUnit:'',mobileSidebar:true,assemblyExpanded:new Set(['crane']),assemblySelected:'',woOpen:false,woId:'',woTab:'info',woReplacementSlot:'',meterComponentId:'',meterDefId:''};
function save(){try{localStorage.setItem(KEY,JSON.stringify(db));}catch{toast('Trình duyệt không lưu được dữ liệu; hãy xuất JSON để sao lưu.',true)}}
function node(id){return db.locations.find(x=>x.id===id)}
function comp(id){return db.components.find(x=>x.id===id)}
function child(id){return db.locations.filter(x=>x.parentId===id)}
function level(id){let count=0,p=node(id),s=new Set();while(p&&p.parentId&&!s.has(p.id)){s.add(p.id);count++;p=node(p.parentId)}return count+1}
function path(id){let a=[],p=node(id),seen=new Set();while(p&&!seen.has(p.id)){seen.add(p.id);a.unshift(p);p=node(p.parentId)}return a;}
function installedAt(id){return db.components.filter(x=>x.locationId===id)}
function locName(id){let x=node(id);return x?`${x.code} – ${x.name}`:'Chưa xác định'}
// Trace a technical location upward to the level-1 crane; no dependence on the physical component's current position.
function craneAtLocation(locationId){return path(locationId).find(l=>l.kind==='crane')||null}
// Resolve context at the date of this event. Legacy v1.4 records have no crane snapshot.
// For workshop/repair events, derive the last installation/removal of that SAME component before this event.
function eventCrane(ev){
 if(ev.craneCode)return {id:ev.craneId||'',code:ev.craneCode,name:ev.craneName||'',snapshot:true};
 let slot=ev.toLoc||ev.fromLoc;
 if(!slot){
  const index=db.events.indexOf(ev);
  const prior=db.events.filter((v,i)=>v.componentId===ev.componentId&&(v.toLoc||v.fromLoc)&&(v.date<ev.date||(v.date===ev.date&&(index<0||i<index))));
  prior.sort((a,b)=>b.date.localeCompare(a.date)||db.events.indexOf(b)-db.events.indexOf(a));
  slot=prior[0]?.toLoc||prior[0]?.fromLoc||null;
 }
 const crane=slot?craneAtLocation(slot):null;
 return crane?{id:crane.id,code:crane.code,name:crane.name,snapshot:false}:null;
}
function eventCraneDisplay(ev){
 const c=eventCrane(ev);
 if(!c)return '<span class="muted">Chưa có cẩu liên kết</span>';
 const label=c.code+(c.name?' – '+c.name:'');
 return c.id&&node(c.id)?showLink('loc',c.id,label):e(label);
}
function eventCraneLabel(ev){return ev.toLoc||ev.fromLoc?'Cẩu cấp 1':'Cẩu lắp gần nhất'}
// Convert legacy v1.4 records into immutable crane snapshots on first load/import.
// No historical records are added; only their missing level-1 parent is resolved.
function captureMissingCraneSnapshots(){
 let updated=false;
 for(const ev of db.events.slice().sort((a,b)=>String(a.date||'').localeCompare(String(b.date||'')))){
  if(ev.craneCode)continue;
  const crane=eventCrane(ev);
  if(!crane)continue;
  Object.assign(ev,{craneId:crane.id,craneCode:crane.code,craneName:crane.name});
  updated=true;
 }
 return updated;
}
function cmpName(id){let x=comp(id);return x?`${x.code} – ${x.name}`:'Không gắn thiết bị'}
function isCompatible(c,l){return Boolean(c&&l&&((c.kind==='gearbox'&&l.kind==='gearbox-slot')||(c.kind==='spreader'&&l.kind==='spreader-slot')))}
function money(n){return (Number(n)||0).toLocaleString('vi-VN')+' đ'}
function shortMoney(n){let v=Number(n)||0;return v>=1e9?(v/1e9).toLocaleString('vi-VN',{maximumFractionDigits:2})+' tỷ':v>=1e6?(v/1e6).toLocaleString('vi-VN',{maximumFractionDigits:1})+' triệu':money(v)}
function date(d){if(!d)return '—';let a=String(d).slice(0,10).split('-');return a.length===3?a.reverse().join('/'):d}
function datetime(d){return `${date(d)}${String(d||'').includes('T')?' '+String(d).slice(11,16):''}`}
function today(){let d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')}
function stamp(){return today()+'T'+new Date().toTimeString().slice(0,5)}
function ident(p='ID'){return p+'-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7)}
function trim(v){return String(v||'').trim()}
function costOf(id){return db.costs.filter(x=>x.componentId===id).reduce((s,x)=>s+(Number(x.amount)||0),0)}
function countOps(id){return db.events.filter(x=>x.componentId===id&&['install','remove'].includes(x.type)).length}
// Ba trạng thái nghiệp vụ của hộp giảm tốc / khung chụp.
// 'retired' chỉ được giữ để đọc dữ liệu cũ; không có trong lựa chọn trạng thái hiện hành.
const STATUS={installed:['Đang sử dụng','green'],warehouse:['Dự phòng','blue'],repair:['Sửa chữa/bảo dưỡng','amber']};
const LEGACY_STATUS={retired:['Ngừng sử dụng (dữ liệu cũ)','gray']};
const EVENT_LABEL={install:'Lắp lên cẩu',remove:'Tháo khỏi cẩu',send:'Gửi đơn vị sửa chữa',complete:'Hoàn tất sửa chữa',retire:'Ngừng sử dụng'};
const WO_STATUS={open:['Mới tạo','blue'],progress:['Đang thực hiện','amber'],done:['Hoàn thành','green'],cancel:['Đã hủy','gray']};
function badge(txt,color='blue'){return `<span class="badge ${color}">${e(txt)}</span>`}
function statusBadge(status){let s=STATUS[status]||LEGACY_STATUS[status]||[status,'gray'];return badge(s[0],s[1])}
function woBadge(status){let s=WO_STATUS[status]||[status,'gray'];return badge(s[0],s[1])}
function button(action,title,cls='btn',attrs=''){return `<button type="button" class="${cls}" data-action="${action}" ${attrs}>${title}</button>`}
function selectNode(type,id){ui.meterComponentId='';ui.meterDefId='';const object=type==='loc'?node(id):comp(id);if(!object)return;ui.page='assets';ui.selected=type+':'+id;ui.detail='info';ui.detailOpen=true;if(type==='loc')path(id).forEach(x=>ui.expanded.add(x.id));if(type==='cmp'&&comp(id)?.locationId)path(comp(id).locationId).forEach(x=>ui.expanded.add(x.id));if(type==='loc'&&level(id)===1)ui.assemblyExpanded.add(id);render()}
function current(){let [t,...r]=ui.selected.split(':');return {type:t,id:r.join(':'),object:t==='loc'?node(r.join(':')):comp(r.join(':'))}}
function drawTree(){const q=ui.treeSearch.toLocaleLowerCase('vi-VN');let res='';function row(x){let kids=child(x.id),match=!q||(`${x.code} ${x.name}`).toLocaleLowerCase('vi-VN').includes(q),showKids=kids.some(hasMatch);if(!match&&!showKids)return '';let lv=level(x.id),opened=q?true:ui.expanded.has(x.id),selected=ui.selected==='loc:'+x.id;
let badgeUnits=installedAt(x.id).map(c=>`<button class="text-link" data-action="select-cmp" data-id="${e(c.id)}">${e(c.code)}</button>`).join(', ');
return `<div class="tree-row ${selected?'selected':''}" style="padding-left:${Math.max(0,(lv-1)*14)}px"><button type="button" class="tree-caret ${kids.length?'':'invisible'}" data-action="expand" data-id="${e(x.id)}" aria-label="Mở rộng">${opened?'⌄':'›'}</button><button type="button" class="tree-link ${selected?'active':''}" data-action="select-loc" data-id="${e(x.id)}">${icon(x.kind==='crane'?'crane':x.kind==='gearbox-slot'?'gear':x.kind==='spreader-slot'?'layers':'box')}<span class="tree-text" title="${e(x.code+' - '+x.name)}">${e(x.code)} · ${e(x.name)}</span></button></div>${badgeUnits?`<div class="tree-unit" style="margin-left:${lv*14+25}px">${icon('link',12)} Đang lắp: ${badgeUnits}</div>`:''}${opened?kids.map(row).join(''):''}`}
function hasMatch(x){if(!q)return true;if((x.code+' '+x.name).toLocaleLowerCase('vi-VN').includes(q))return true;return child(x.id).some(hasMatch)}
res=db.locations.filter(x=>!x.parentId).map(row).join('');return res||'<div class="empty">Không tìm thấy vị trí phù hợp.</div>'}
function header(){const items=[['reports','Báo cáo','chart'],['references','Hướng dẫn demo','info']];return `<header class="topbar"><div class="brand"><span class="brand-logo">${icon('crane')}</span><div><b>PortAsset CMMS</b><small>Quản lý tài sản cẩu • v1.5.1</small></div></div><nav class="topnav">${items.map(([k,t,i])=>`<button type="button" class="${ui.page===k?'active':''}" data-action="page" data-id="${k}">${icon(i)} ${t}</button>`).join('')}</nav><div class="toptools"><span class="safety-chip">${icon('check',14)} PUBLIC SAFE · Dữ liệu mô phỏng</span>${button('more',icon('save')+' Dữ liệu','btn nav-data small')}<span class="avatar">DM</span></div></header>`}
function sidebar(){return `<aside class="sidebar"><div class="sidetitle"><b>${icon('layers')} Cấu trúc cẩu mẫu</b>${button('new-node',icon('plus'),'btn small icon-only','title="Thêm vị trí tài sản"')}</div><div class="sidebody"><div class="field-search">${icon('search')}<input id="tree-search" type="search" placeholder="Tìm mã, tên vị trí..." value="${e(ui.treeSearch)}" aria-label="Tìm cây tài sản"></div><div class="tree">${drawTree()}</div></div><div class="sidefoot"><b>${db.locations.length}</b> vị trí trong cây • <b>${db.components.length}</b> thiết bị vật lý<br>Vị trí kỹ thuật ≠ thiết bị có serial</div></aside>`}
function moduleNav(){const items=[['assets','Tài sản','asset'],['workorders','Công việc','clipboard']];return `<aside class="module-nav" aria-label="Phân hệ quản lý"><div class="module-nav-header">${icon('layers',18)} <b>Quản lý cảng</b></div><nav class="module-nav-items">${items.map(([k,title,ico])=>`<button type="button" class="module-nav-link ${ui.page===k?'active':''}" data-action="page" data-id="${k}">${icon(ico,19)}<span>${title}</span></button>`).join('')}</nav><div class="module-nav-caption">CMMS / EAM · Dữ liệu mô phỏng</div></aside>`}
function heading(){let isAssets=ui.page==='assets',title=isAssets?'Quản lý tài sản cẩu':ui.page==='workorders'?'Công việc / Work Order':ui.page==='reports'?'Báo cáo tài sản & chi phí':'Hướng dẫn bản demo';return `<div class="pageheading grid-heading"><div><div class="eyebrow">QUẢN LÝ TÀI SẢN / CẨU CONTAINER · DỮ LIỆU MÔ PHỎNG</div><h1>${title}</h1><p class="intro">${isAssets?'Cây tài sản cấp 1 → cấp N • Chọn mã hoặc tên tài sản để mở hồ sơ chi tiết.':ui.page==='workorders'?'Danh sách công việc bảo trì và giao dịch tháo/lắp liên kết WO.':ui.page==='reports'?'Tổng hợp chi phí, tình trạng thiết bị theo dữ liệu giả lập.':'Mô hình quản lý thiết bị luân chuyển và bảo trì.'}</p></div><div class="headingactions">${isAssets?`${button('new-node',icon('plus')+' Thêm tài sản','btn primary')}${button('new-component',icon('box')+' Khai báo thiết bị','btn')}`:''}</div></div>`}
function infoRow(k,v,wide=false){return `<div class="info-row ${wide?'wide':''}"><span class="key">${e(k)}</span><span class="val">${v===undefined||v===null||v===''?'—':v}</span></div>`}
function showLink(type,id,label){return `<button class="text-link" data-action="select-${type}" data-id="${e(id)}">${e(label)}</button>`}
function componentOverview(c){let spot=c.locationId?node(c.locationId):null;return `<div class="card"><div class="selected-header"><div class="subject-icon">${icon(c.kind==='gearbox'?'gear':'layers')}</div><div class="subject-details">${badge('THIẾT BỊ VẬT LÝ • CÓ THỂ THÁO RỜI','blue')}<h2>${e(c.code)}</h2><p>${e(c.name)}</p><div class="minirow">${badge(c.kind==='gearbox'?'Hộp giảm tốc':'Khung chụp','gray')}${statusBadge(c.status)}</div></div></div><div class="tabs">${tab('info','Thông tin chung')}${tab('work','Work Order')}${tab('cost','Chi phí')}${tab('history','Lịch sử')}</div></div>${componentDetail(c,spot)}`}
function tab(id,title){return `<button class="${ui.detail===id?'active':''}" type="button" data-action="detail" data-id="${id}">${title}</button>`}
function componentDetail(c,spot){if(ui.detail==='work')return woTable(db.workorders.filter(x=>x.componentId===c.id),`Work Order của ${c.code}`);if(ui.detail==='cost')return costTable(db.costs.filter(x=>x.componentId===c.id),`Chi phí vòng đời • ${money(costOf(c.id))}`);if(ui.detail==='history')return activityTable(db.events.filter(x=>x.componentId===c.id),`Lịch sử thiết bị ${c.code}`);
 return `<div class="card"><div class="subtle-title"><h2>${icon('info')} Hồ sơ thiết bị</h2>${button('edit-component',icon('edit')+' Chỉnh sửa','btn small',`data-id="${e(c.id)}"`)}</div><div class="info-grid">${infoRow('Mã định danh',e(c.code))}${infoRow('Số serial',e(c.serial||''))}${infoRow('Tên thiết bị',e(c.name))}${infoRow('Nhóm',e(c.kind==='gearbox'?'Hộp giảm tốc / Rotable':'Khung chụp / Rotable'))}${infoRow('Tình trạng',statusBadge(c.status))}${infoRow('Tình trạng kỹ thuật',e(c.condition))}${infoRow('Vị trí đặt hiện tại',spot?showLink('loc',spot.id,locName(spot.id)):'Chưa lắp trên cẩu')}${infoRow('Địa điểm thực tế',e(c.place))}${infoRow('Model',e(c.model))}${infoRow('Hãng sản xuất',e(c.maker))}${infoRow('Năm sản xuất',e(c.year))}${infoRow('Số giao dịch tháo/lắp',String(countOps(c.id)))}${infoRow('Ghi chú',e(c.notes||'—'),true)}</div><div class="note-block">${icon('info')} Mã <b>${e(c.code)}</b> theo thiết bị vật lý và <b>không đổi</b> khi tháo, gửi sửa chữa, nhập kho hoặc lắp sang cẩu khác.</div><div class="btn-group" style="margin-top:14px">${button('movement',icon('move')+' Tháo/lắp / chuyển xưởng','btn primary',`data-id="${e(c.id)}"`)}${button('new-wo',icon('clipboard')+' Tạo Work Order','btn',`data-id="${e(c.id)}"`)}${button('new-cost',icon('cash')+' Ghi chi phí','btn',`data-id="${e(c.id)}"`)}</div></div>`}
function locationOverview(l){let lv=level(l.id),units=installedAt(l.id),compat=l.kind==='gearbox-slot'?'Hộp giảm tốc':l.kind==='spreader-slot'?'Khung chụp':null;return `<div class="card"><div class="selected-header"><div class="subject-icon">${icon(l.kind==='crane'?'crane':l.kind==='gearbox-slot'?'gear':'asset')}</div><div class="subject-details">${badge('CẤP '+lv+' • VỊ TRÍ / CỤM KỸ THUẬT','blue')}<h2>${e(l.name)}</h2><p>${e(l.code)} ${l.parentId?' · Thuộc '+e(node(l.parentId)?.name):' · Cẩu minh họa'}</p></div></div><div class="tabs">${tab('info','Thông tin chung')}${tab('work','Work Order')}${tab('cost','Chi phí')}${tab('history','Lịch sử')}</div></div>${locationDetail(l,units,compat)}`}
function locationDetail(l,units,compat){const rootCrane=craneAtLocation(l.id)||node('crane');let relatedUnits=db.components.filter(x=>x.locationId===l.id||db.events.some(z=>z.componentId===x.id&&(z.fromLoc===l.id||z.toLoc===l.id)));if(ui.detail==='work')return woTable(db.workorders.filter(x=>x.locationId===l.id),`Work Order tại ${l.name}`);if(ui.detail==='cost')return costTable(db.costs.filter(x=>x.locationId===l.id),`Chi phí phân bổ vào vị trí • ${money(db.costs.filter(x=>x.locationId===l.id).reduce((s,c)=>s+c.amount,0))}`,true);if(ui.detail==='history')return activityTable(db.events.filter(x=>x.fromLoc===l.id||x.toLoc===l.id),`Lịch sử vị trí ${l.name}`,true);
 return `<div class="card"><div class="subtle-title"><h2>${icon('info')} Thông tin vị trí kỹ thuật – cấp ${level(l.id)}</h2>${button('edit-node',icon('edit')+' Chỉnh sửa','btn small',`data-id="${e(l.id)}"`)}</div><div class="info-grid">${infoRow('Mã kỹ thuật',e(l.code))}${infoRow('Tên tài sản',e(l.name))}${infoRow('Cấp tài sản','Cấp '+level(l.id))}${infoRow('Tài sản cha',l.parentId?showLink('loc',l.parentId,node(l.parentId)?.name):'Cấp cao nhất')}${infoRow('Phân loại vị trí',e(compat|| (l.kind==='crane'?'Cẩu minh họa':'Cụm / bộ phận')))}${infoRow('Đơn vị quản lý',e(rootCrane.manager))}${l.kind==='crane'?`${infoRow('Model',e(l.model))}${infoRow('Số khung',e(l.serial))}${infoRow('Hãng sản xuất',e(l.maker))}${infoRow('Năm sản xuất',e(l.manufactureYear))}${infoRow('Ngày sử dụng',date(l.inService))}${infoRow('Vị trí',e(l.site))}${infoRow('Đơn vị sở hữu',e(l.owner))}${infoRow('Mã đăng kiểm (demo)',e(l.registration))}`:''}${infoRow('Ghi chú',e(l.notes||'—'),true)}</div>${compat?`<div class="separator"></div><h3>Thiết bị vật lý đang lắp vào vị trí này</h3>${units.length?units.map(c=>`<div class="row-card"><div><b>${showLink('cmp',c.id,c.code+' – '+publicNarrative(c.name))}</b><small>${e(c.serial||'Không có serial')} • ${e(c.condition)}</small></div>${statusBadge(c.status)}</div>`).join(''):'<div class="note-block">Vị trí đang trống. Có thể chọn một thiết bị vật lý phù hợp từ kho để lắp.</div>'}<div class="btn-group" style="margin-top:13px">${button('movement',icon('move')+' Ghi nhận lắp/tháo','btn primary',`data-slot="${e(l.id)}"`)}${button('new-component',icon('plus')+' Khai báo thiết bị','btn')}</div>`:''}${l.kind==='crane'?`<div class="note-block">Cấp 1 có nhiều thông tin hồ sơ. Các cấp 2–3 chỉ hiển thị thông tin thực sự cần quản lý. Cây tài sản này là ví dụ mô phỏng nghiệp vụ, không phải hồ sơ cẩu thực tế.</div>`:''}</div>`}
function activityText(ev){let c=comp(ev.componentId);let t=EVENT_LABEL[ev.type]||ev.type;let loc=ev.toLoc||ev.fromLoc;return `${t}${loc?' • '+(node(loc)?.name||loc):''}${ev.place?' • '+ev.place:''}`}
function timeline(events,n=5){let a=[...events].sort((x,y)=>y.date.localeCompare(x.date)).slice(0,n);return a.length?`<div class="timeline">${a.map(ev=>`<div class="tl-item"><div class="tl-date">${datetime(ev.date)} · ${showLink('cmp',ev.componentId,unitCode(ev.componentId))}</div><div class="tl-action">${e(EVENT_LABEL[ev.type]||ev.type)}</div><div class="tl-note">${e((ev.toLoc?locName(ev.toLoc):ev.fromLoc?locName(ev.fromLoc):ev.place)||'')}${ev.note?' · '+e(publicNarrative(publicNarrative(ev.note))):''}</div><div class="tl-crane">${eventCraneLabel(ev)}: ${eventCraneDisplay(ev)}</div></div>`).join('')}</div>`:'<p class="muted">Chưa có giao dịch.</p>'}
function rightPanel(){let {type,id,object}=current();let c=type==='cmp'?object:null,location=type==='loc'?object:node(c?.locationId);let events=c?db.events.filter(x=>x.componentId===c.id):db.events.filter(x=>x.fromLoc===id||x.toLoc===id);const rootCrane=craneAtLocation(location?.id)||node('crane');let linkedUnits=c?[c]:type==='loc'?installedAt(id):[];
return `<div><div class="card"><h2>${icon('pin')} Vị trí & trạng thái</h2><div class="status-grid"><span>Đối tượng đang xem</span><span>${type==='cmp'?'Thiết bị vật lý':'Vị trí kỹ thuật'}</span><span>Tình trạng</span><span>${c?statusBadge(c.status):badge('Đang quản lý','green')}</span><span>Vị trí hiện tại</span><span>${e(c?c.place:(rootCrane.site||'Cẩu Demo 01'))}</span><span>Thuộc cẩu</span><span>${showLink('loc',rootCrane.id,rootCrane.name+' – '+rootCrane.code)}</span><span>Thiết bị đang lắp</span><span>${linkedUnits.length?linkedUnits.map(z=>showLink('cmp',z.id,z.code)).join(', '):'—'}</span><span>Đối tượng cấp trên</span><span>${location?.parentId?showLink('loc',location.parentId,node(location.parentId)?.name):'—'}</span></div></div><div class="card"><div class="subtle-title"><h2>${icon('history')} Lịch sử tháo / lắp</h2>${button('page','Xem tất cả','btn ghost small','data-id="movements"')}</div>${timeline(events,6)}</div><div class="card"><div class="subtle-title"><h2>${icon('cash')} Chi phí bảo trì (mẫu)</h2>${button('page','Báo cáo','btn ghost small','data-id="reports"')}</div><div class="metrics-2"><div class="metric compact"><small>Chi phí thiết bị</small><strong>${shortMoney(c?costOf(c.id):linkedUnits.reduce((s,x)=>s+costOf(x.id),0))}</strong></div><div class="metric compact"><small>Lần tháo/lắp</small><strong>${c?countOps(c.id):events.filter(x=>['install','remove'].includes(x.type)).length}</strong></div></div><p class="small-note">Chi phí gắn với mã thiết bị, có tham chiếu WO và vị trí. Không tự nhân đôi khi tổng hợp.</p></div></div>`}
function recentWOTable(ws,n=4){let a=[...ws].sort((x,y)=>y.date.localeCompare(x.date)).slice(0,n);return `<div class="scroll-table"><table class="data-table"><thead><tr><th>Work Order</th><th>Nội dung</th><th>Trạng thái</th></tr></thead><tbody>${a.length?a.map(w=>`<tr><td><b style="color:var(--blue)">${e(w.code)}</b><div class="light">${date(w.date)}</div></td><td>${e(publicNarrative(w.title))}</td><td>${woBadge(w.status)}</td></tr>`).join(''):'<tr><td colspan="3">Chưa có Work Order</td></tr>'}</tbody></table></div>`}
function assetsView(){let {type,object,id}=current();if(!object){ui.selected='loc:crane';return assetsView()}let ws=type==='cmp'?db.workorders.filter(x=>x.componentId===id):db.workorders.filter(x=>x.locationId===id);return `<div class="split"><div>${type==='cmp'?componentOverview(object):locationOverview(object)}<div class="bottom-grid"><div class="card"><div class="subtle-title"><h2>${icon('clipboard')} Work Order liên quan</h2>${button('new-wo',icon('plus')+' Tạo WO','btn small',`data-id="${type==='cmp'?e(id):''}" data-slot="${type==='loc'?e(id):''}"`)}</div>${recentWOTable(ws)}</div><div class="card"><div class="subtle-title"><h2>${icon('layers')} Thiết bị luân chuyển</h2>${button('page','Danh mục →','btn ghost small','data-id="components"')}</div>${db.components.filter(c=>type==='cmp'?c.kind===object.kind:(c.locationId===id||db.events.some(z=>z.componentId===c.id&&(z.fromLoc===id||z.toLoc===id)))).slice(0,4).map(c=>`<div class="row-card"><div><b>${showLink('cmp',c.id,c.code)}</b><small>${e(c.name)}</small></div>${statusBadge(c.status)}</div>`).join('')||'<p class="muted">Chưa có thiết bị liên quan.</p>'}</div></div></div>${rightPanel()}</div>`}
function componentsView(){let parts=db.components.filter(c=>(ui.partStatus==='all'||ui.partStatus===c.status)&&(ui.partKind==='all'||ui.partKind===c.kind)&&(`${c.code} ${c.name} ${c.serial} ${c.place}`).toLocaleLowerCase('vi-VN').includes(ui.partSearch.toLocaleLowerCase('vi-VN')));return `<div class="section-banner">${icon('info')} <div><b>Rotable / Repairable Component:</b> quản lý hộp giảm tốc và khung chụp bằng mã tài sản riêng; mỗi thời điểm chỉ được lắp tại tối đa một vị trí.</div></div><div class="card"><div class="filters"><input type="search" class="input filter-wide" id="parts-search" placeholder="Tìm mã, tên, serial, địa điểm..." value="${e(ui.partSearch)}"><select id="parts-kind" class="select"><option value="all">Tất cả loại</option><option value="gearbox" ${ui.partKind==='gearbox'?'selected':''}>Hộp giảm tốc</option><option value="spreader" ${ui.partKind==='spreader'?'selected':''}>Khung chụp</option></select><select id="parts-status" class="select"><option value="all">Tất cả trạng thái</option>${Object.entries(STATUS).map(([k,v])=>`<option value="${k}" ${ui.partStatus===k?'selected':''}>${v[0]}</option>`).join('')}</select>${button('new-component',icon('plus')+' Thêm thiết bị','btn primary')}</div><div class="kpis"><div class="metric"><small>Tổng thiết bị được quản lý</small><strong>${db.components.length}</strong></div><div class="metric"><small>Đang sử dụng</small><strong>${db.components.filter(x=>x.status==='installed').length}</strong></div><div class="metric"><small>Dự phòng</small><strong>${db.components.filter(x=>x.status==='warehouse').length}</strong></div><div class="metric"><small>Sửa chữa/bảo dưỡng</small><strong>${db.components.filter(x=>x.status==='repair').length}</strong></div></div></div><div class="card-grid">${parts.length?parts.map(c=>`<article class="part-card"><div class="part-head"><span class="part-code">${icon(c.kind==='gearbox'?'gear':'layers')} ${e(c.code)}</span>${statusBadge(c.status)}</div><h3>${e(c.name)}</h3><p><b>Serial:</b> ${e(c.serial||'Chưa khai báo')}<br><b>Địa điểm:</b> ${e(c.place||'Chưa xác định')}</p><div class="part-foot"><span class="small-note">Chi phí: <b>${shortMoney(costOf(c.id))}</b></span>${button('select-cmp','Xem hồ sơ →','btn small',`data-id="${e(c.id)}"`)}</div><div class="btn-group" style="margin-top:11px">${button('movement',icon('move')+' Tháo/lắp','btn small',`data-id="${e(c.id)}"`)}${button('new-wo',icon('clipboard')+' WO','btn small',`data-id="${e(c.id)}"`)}</div></article>`).join(''):'<div class="empty"><b>Không tìm thấy thiết bị</b>Thử điều chỉnh bộ lọc.</div>'}</div>`}
// Location history shows only the three management statuses; event types remain in persisted audit records.
function movementStatusBadge(ev){
 const type=ev.type;
 const inRepair=type==='send'||(type==='remove'&&ev.place&&ev.place!=='Kho kỹ thuật');
 return inRepair?badge('Sửa chữa/bảo dưỡng','amber'):type==='install'?badge('Đang sử dụng','green'):badge('Dự phòng','blue');
}
function activityTable(events,title='Nhật ký luân chuyển',hidePlace=false){
 let a=[...events].sort((x,y)=>y.date.localeCompare(x.date));
 return `<div class="card"><div class="subtle-title"><h2>${icon('history')} ${e(title)}</h2><span class="history-readonly-label">Chỉ xem • ghi nhận từ Thay thế tài sản hoặc Work Order</span></div><div class="scroll-table"><table class="data-table"><thead><tr><th>Thời gian</th><th>Tài sản</th><th>${hidePlace?'Trạng thái':'Loại'}</th>${hidePlace?'':'<th>Vị trí / địa điểm</th>'}<th>Cẩu cấp 1</th><th>WO tham chiếu</th><th>Diễn giải</th></tr></thead><tbody>${a.length?a.map(x=>`<tr><td style="white-space:nowrap">${datetime(x.date)}</td><td>${showLink('cmp',x.componentId,unitCode(x.componentId))}</td><td>${hidePlace?movementStatusBadge(x):badge(EVENT_LABEL[x.type]||x.type,x.type==='install'?'green':x.type==='remove'?'amber':'blue')}</td>${hidePlace?'':`<td>${e((x.toLoc||x.fromLoc)?locName(x.toLoc||x.fromLoc):x.place||'—')}</td>`}<td>${eventCraneDisplay(x)}</td><td>${e(x.woId||'—')}</td><td>${e(publicNarrative(x.note||'—'))}</td></tr>`).join(''):`<tr><td colspan="${hidePlace?6:7}" class="muted">Chưa có nhật ký</td></tr>`}</tbody></table></div></div>`
}
function movementsView(){let a=[...db.events].filter(x=>`${unitCode(x.componentId)} ${x.note} ${x.place||''} ${x.type} ${x.fromLoc||''} ${x.toLoc||''}`.toLocaleLowerCase('vi-VN').includes(ui.logSearch.toLocaleLowerCase('vi-VN')));return `<div class="section-banner">${icon('move')} <div><b>Nguyên tắc:</b> tháo khỏi cẩu → chuyển kho/xưởng/đơn vị nước ngoài → hoàn tất sửa chữa → lắp lại (hoặc lắp sang cẩu khác). Dữ liệu lịch sử không bị xóa khi thay thiết bị.</div></div><div class="card"><div class="filters"><input id="log-search" class="input filter-wide" placeholder="Lọc mã tài sản, loại giao dịch, ghi chú..." value="${e(ui.logSearch)}">${button('movement',icon('plus')+' Ghi nhận nghiệp vụ','btn primary')}</div><div class="steps"><span class="step active">01 · Tháo khỏi vị trí</span><span class="step">02 · Chuyển kho / xưởng</span><span class="step">03 · Nghiệm thu sửa chữa</span><span class="step">04 · Lắp lại / thay thế</span></div></div>${activityTable(a,'Nhật ký tổng hợp · '+a.length+' bản ghi')}`}
function woTable(ws,title='Danh sách Work Order'){let a=[...ws].sort((x,y)=>y.date.localeCompare(x.date));return `<div class="card"><div class="subtle-title"><h2>${icon('clipboard')} ${e(title)}</h2>${button('new-wo',icon('plus')+' Tạo Work Order','btn small',ui.detailOpen?(current().type==='cmp'?`data-id="${e(current().id)}"`:`data-slot="${e(current().id)}"`):'')}</div><div class="scroll-table"><table class="data-table"><thead><tr><th>Số WO / Ngày</th><th>Nội dung</th><th>Vị trí kỹ thuật</th><th>Loại</th><th>Trạng thái</th><th>Chi phí gắn WO</th><th></th></tr></thead><tbody>${a.length?a.map(w=>`<tr><td>${button('open-wo-detail',e(w.code),'grid-link',`data-id="${e(w.id)}"`)}<div class="light">${date(w.date)}</div>${db.events.some(ev=>ev.woId===w.code)?`<div class="light wo-move-tag">${db.events.filter(ev=>ev.woId===w.code).length} giao dịch tháo/lắp</div>`:''}</td><td><b>${e(publicNarrative(w.title))}</b>${w.description?`<div class="light">${e(publicNarrative(w.description))}</div>`:''}</td><td>${w.locationId?showLink('loc',w.locationId,w.locationId):'—'}</td><td>${e(w.type)}</td><td>${woBadge(w.status)}</td><td>${money(db.costs.filter(x=>x.woId===w.id).reduce((s,x)=>s+x.amount,0))}</td><td>${button('open-wo-detail',icon('eye'),'btn small icon-only',`data-id="${e(w.id)}" title="Mở chi tiết công việc"`)}</td></tr>`).join(''):'<tr><td colspan="7">Chưa có Work Order</td></tr>'}</tbody></table></div></div>`}
function workordersView(){let ws=db.workorders.filter(w=>`${w.code} ${w.title} ${unitCode(w.componentId)} ${w.locationId} ${w.description}`.toLocaleLowerCase('vi-VN').includes(ui.woSearch.toLocaleLowerCase('vi-VN')));return `<div class="card"><div class="filters"><input type="search" id="wo-search" class="input filter-wide" placeholder="Tìm số WO, nội dung, thiết bị..." value="${e(ui.woSearch)}">${button('new-wo',icon('plus')+' Tạo Work Order','btn primary')}</div><div class="kpis"><div class="metric"><small>Tổng Work Order</small><strong>${db.workorders.length}</strong></div><div class="metric"><small>Mới tạo</small><strong>${db.workorders.filter(x=>x.status==='open').length}</strong></div><div class="metric"><small>Đang thực hiện</small><strong>${db.workorders.filter(x=>x.status==='progress').length}</strong></div><div class="metric"><small>Hoàn thành</small><strong>${db.workorders.filter(x=>x.status==='done').length}</strong></div></div></div>${woTable(ws,'Danh sách Work Order · '+ws.length)}`}
function costTable(cs,title='Chi phí sửa chữa / bảo dưỡng',historic=false){let a=[...cs].sort((x,y)=>y.date.localeCompare(x.date));return `<div class="card"><div class="subtle-title"><h2>${icon('cash')} ${e(title)}</h2>${button('new-cost',icon('plus')+' Thêm chi phí','btn small',ui.detailOpen&&current().type==='cmp'?`data-id="${e(current().id)}"`:'')}</div>${historic?'<div class="section-banner warn">Lưu ý: Các chi phí được ghi theo vị trí đã chọn khi phát sinh, kể cả khi thiết bị đã được tháo khỏi cẩu. Cần có quy tắc xác định vị trí hưởng chi phí khi thực hiện trên hệ thống thật.</div>':''}<div class="scroll-table"><table class="data-table"><thead><tr><th>Ngày</th><th>Tài sản</th><th>Loại chi phí</th><th>Tham chiếu WO</th><th>Vị trí hưởng phí</th><th>Diễn giải</th><th style="text-align:right">Số tiền</th></tr></thead><tbody>${a.length?a.map(x=>`<tr><td>${date(x.date)}</td><td>${showLink('cmp',x.componentId,unitCode(x.componentId))}</td><td>${e(x.category)}</td><td>${e(x.woId||'—')}</td><td>${x.locationId?e(node(x.locationId)?.code||x.locationId):'—'}</td><td>${e(publicNarrative(publicNarrative(x.note)))}</td><td style="text-align:right;font-weight:800">${money(x.amount)}</td></tr>`).join(''):'<tr><td colspan="7">Chưa có chi phí</td></tr>'}</tbody></table></div></div>`}
function reportsView(){const total=db.costs.reduce((s,x)=>s+x.amount,0);let cmpCosts=db.components.map(c=>({c,price:costOf(c.id)})).sort((a,b)=>b.price-a.price);return `<div class="section-banner warn">${icon('info')} <div>Đây là cây tài sản mô phỏng. Demo gồm <b>5 cẩu mô phỏng</b> với hộp giảm tốc và khung chụp có lịch sử để thử luồng thay thế. <b>Số lượng, cấu hình và thông số trên màn hình không đại diện thiết bị của bất kỳ cảng thực tế nào.</b></div></div><div class="card"><div class="kpis"><div class="metric"><small>Vị trí / cụm trong cây</small><strong>${db.locations.length}</strong><span class="light">Cấp 1–2–3</span></div><div class="metric"><small>Thiết bị vật lý có serial</small><strong>${db.components.length}</strong><span class="light">Gearbox và spreader</span></div><div class="metric"><small>Đang gửi sửa chữa</small><strong>${db.components.filter(c=>c.status==='repair').length}</strong><span class="light">Trong nước / nước ngoài</span></div><div class="metric"><small>Chi phí ghi nhận (demo)</small><strong>${shortMoney(total)}</strong><span class="light">Không cộng trùng theo WO</span></div></div></div><div class="two-up"><div class="card"><h2>${icon('chart')} Chi phí theo thiết bị vật lý</h2>${cmpCosts.map(({c,price})=>`<div class="row-card"><div><b>${showLink('cmp',c.id,c.code)}</b><small>${e(c.name)}</small></div><b>${money(price)}</b></div>`).join('')}</div><div class="card"><h2>${icon('asset')} Tổng hợp hiện trạng luân chuyển</h2>${db.components.map(c=>`<div class="row-card"><div><b>${showLink('cmp',c.id,c.code)}</b><small>${e(c.place)}</small></div>${statusBadge(c.status)}</div>`).join('')}</div></div>${costTable(db.costs,'Sổ chi phí chi tiết • '+money(total))}`}
function referencesView(){
 const scenario=[
  ['01','Tài sản cha / con','Cẩu Demo 01 → cơ cấu / cụm → vị trí đặt theo cấp 1, 2, 3.'],
  ['02','Thiết bị có mã riêng','SIM01.02.1 / SIM01.03 có mã tài sản riêng, không phụ thuộc mã cẩu.'],
  ['03','Tháo và thay thế','Tháo SIM01.02.1 → đưa về kho / xưởng → lắp thiết bị dự phòng SIM-DP.HGT.006.'],
  ['04','Gửi sửa chữa','Chọn đơn vị nội bộ, trong nước hoặc nước ngoài; lưu lịch sử.'],
  ['05','Nghiệm thu và lắp lại','Thiết bị trở về kho và sẵn sàng lắp vào vị trí trống.'],
  ['06','WO và chi phí','Chi phí thuộc thiết bị, có tham chiếu WO / vị trí hưởng phí.']
 ];
 return `<div class="section-banner">${icon('info')} <div><b>PUBLIC SAFE:</b> Không chứa ảnh gốc, mã cẩu thật, hãng, số serial, đơn vị hay thông tin vận hành thực tế. Toàn bộ dữ liệu trên website chỉ dùng minh họa nghiệp vụ. <b>Không nhập dữ liệu nội bộ thật vào demo công khai.</b></div></div>
 <div class="card"><h2>${icon('layers')} Nguyên tắc quản lý</h2><div class="note-block">Tài sản HGT / khung chụp trong cây có mã kỹ thuật (ví dụ <b>SIM01.02.1</b>); các thiết bị dự phòng mang mã SIM-DP riêng và có serial để theo dõi xuyên suốt các lần tháo/lắp. Thao tác thay thế không xóa lịch sử, Work Order hoặc chi phí.</div><div class="steps"><span class="step active">Cẩu mẫu</span><span class="step">Cụm kỹ thuật</span><span class="step">Vị trí đặt</span><span class="step">Thiết bị độc lập</span></div></div>
 <div class="card"><h2>${icon('clipboard')} Các kịch bản tương tác để thảo luận</h2><div class="card-grid">${scenario.map(([num,title,desc])=>`<div class="part-card"><div class="part-head"><span class="part-code">${num}</span>${icon('check')}</div><h3>${e(title)}</h3><p>${e(desc)}</p></div>`).join('')}</div></div>`;
}

// v1.2: Full-width Grid View and separate full-screen SpeedMaint-like asset details.
function subtreeIds(id){return db.locations.filter(x=>x.id===id||path(x.id).some(z=>z.id===id)).map(x=>x.id)}
function scopedComponents(id){const set=new Set(subtreeIds(id));return db.components.filter(c=>c.locationId&&set.has(c.locationId)||db.events.some(v=>v.componentId===c.id&&(set.has(v.toLoc)||set.has(v.fromLoc))))}
function scopedWOs(id){const set=new Set(subtreeIds(id));return db.workorders.filter(w=>set.has(w.locationId)||(w.componentId&&scopedComponents(id).some(c=>c.id===w.componentId)))}
function scopedEvents(id){const set=new Set(subtreeIds(id));return db.events.filter(v=>set.has(v.toLoc)||set.has(v.fromLoc)||(!v.fromLoc&&!v.toLoc&&eventCrane(v)?.id===id))}
function scopedCosts(id){const set=new Set(subtreeIds(id));return db.costs.filter(c=>set.has(c.locationId)||(!c.locationId&&comp(c.componentId)&&db.events.some(ev=>ev.componentId===c.componentId&&eventCrane(ev)?.id===id)))}
function nodeTitle(l){return l.kind==='crane'?'Cẩu bờ':l.kind==='gearbox-slot'?'Hộp giảm tốc':l.kind==='spreader-slot'?'Khung chụp':level(l.id)===2?'Cụm kỹ thuật':'Bộ phận'}
function visibleTree(){let q=ui.gridSearch.trim().toLocaleLowerCase('vi-VN'),levelF=ui.gridLevel,status=ui.gridStatus;
 let forced=q||levelF!=='all'||status!=='all';
 function matches(x){let units=installedAt(x.id),found=!q||(x.code+' '+x.name+' '+units.map(c=>c.code+' '+c.name+' '+c.serial).join(' ')).toLocaleLowerCase('vi-VN').includes(q);return found&&(levelF==='all'||level(x.id)===Number(levelF))&&(status==='all'||(status==='installed'&&units.length>0)||(status==='empty'&&x.kind?.includes('slot')&&!units.length))}
 function hasMatch(x){return matches(x)||child(x.id).some(hasMatch)}
 const a=[];function go(x){if(!x||!hasMatch(x))return;const deep=level(x.id);if(!forced||matches(x))a.push(x);if(forced||ui.expanded.has(x.id))for(const z of child(x.id))go(z)}for(const root of db.locations.filter(x=>!x.parentId))go(root);return a
}
function assetRow(l){const lv=level(l.id),kids=child(l.id),isChecked=ui.checked.has(l.id);return `<tr class="asset-tr ${isChecked?'marked':''}" data-level="${lv}">
 <td class="checkbox-col"><input aria-label="Chọn ${e(l.code)}" type="checkbox" data-check="${e(l.id)}" ${isChecked?'checked':''}></td>
 <td class="asset-tree-cell"><div class="asset-tree-inner" style="--depth:${Math.max(0,lv-1)}">${kids.length?button('expand',ui.expanded.has(l.id)?icon('down',15):'›','grid-expander',`data-id="${e(l.id)}" title="Mở / thu gọn"`):'<span class="grid-expander-placeholder"></span>'}<span class="grid-tree-symbol">${icon(l.kind==='crane'?'crane':l.kind==='gearbox-slot'?'gear':l.kind==='spreader-slot'?'layers':lv===2?'asset':'box',19)}</span>${button('select-loc',e(l.code),'grid-link',`data-id="${e(l.id)}"`)}</div></td>
 <td class="asset-name-cell">${button('select-loc',e(l.name),'grid-name',`data-id="${e(l.id)}"`)}</td>
 <td class="image-col"><div class="placeholder-photo">${icon('photo',20)}<small>Ảnh mẫu</small></div></td>
 <td>${badge('Cấp '+lv,lv===1?'blue':lv===2?'gray':'green')}</td>
 <td>${lv===1?`<span class="muted">${e(nodeTitle(l))}</span>`:'—'}</td>
 <td>${badge('Hoạt động','green')}</td>
 <td class="row-quick">${button('select-loc',icon('eye',15),'grid-open',`data-id="${e(l.id)}" title="Mở chi tiết"`)}</td>
 </tr>`}
function gridView(){let a=visibleTree();const maxPage=Math.max(1,Math.ceil(a.length/ui.gridPageSize));ui.gridPage=Math.min(ui.gridPage,maxPage);const start=(ui.gridPage-1)*ui.gridPageSize,sub=a.slice(start,start+ui.gridPageSize),root=db.locations.length;return `<div class="assets-page"><div class="grid-toolbar card"><div class="grid-toolbar-row"><label class="grid-search">${icon('search')}<input id="grid-search" type="search" placeholder="Tìm theo mã, tên, hộp giảm tốc, thiết bị..." value="${e(ui.gridSearch)}"></label><label class="toolbar-label">Cấp <select id="grid-level" class="select"><option value="all">Tất cả</option>${[1,2,3,4,5,6].map(v=>`<option value="${v}" ${ui.gridLevel===String(v)?'selected':''}>Cấp ${v}</option>`).join('')}</select></label><label class="toolbar-label">Vị trí <select id="grid-status" class="select"><option value="all">Tất cả</option><option value="installed" ${ui.gridStatus==='installed'?'selected':''}>Đã lắp thiết bị</option><option value="empty" ${ui.gridStatus==='empty'?'selected':''}>Vị trí trống</option></select></label><div class="toolbar-spacer"></div>${button('expand-all',icon('down')+' Mở tất cả','btn small')}${button('collapse-all',icon('up')+' Thu gọn','btn small')}${button('more',icon('save')+' Dữ liệu','btn small')}</div></div>
 <div class="grid-table-card card"><div class="grid-card-title"><div><b>${icon('asset')} Danh sách tài sản</b><span class="meta-small">${root} tài sản kỹ thuật · ${db.components.length} thiết bị luân chuyển</span></div><span class="grid-hint">${icon('info',14)} Bấm mã hoặc tên để xem chi tiết</span></div><div class="grid-scroll"><table class="grid-asset-table"><thead><tr><th class="checkbox-col"><input id="check-all" type="checkbox" aria-label="Chọn tất cả dòng đang hiển thị" ${sub.length>0&&sub.every(l=>ui.checked.has(l.id))?'checked':''}></th><th>Cấu trúc</th><th>Tên tài sản</th><th>Hình ảnh</th><th>Cấp</th><th>Loại tài sản</th><th>Trạng thái</th><th></th></tr></thead><tbody>${sub.map(assetRow).join('')||`<tr><td colspan="8"><div class="grid-empty">${icon('search',28)}<b>Không có tài sản phù hợp</b>Thử đổi từ khóa hoặc bộ lọc.</div></td></tr>`}</tbody></table></div>
 <div class="grid-table-footer"><div class="grid-selected-count">${ui.checked.size?'Đã chọn '+ui.checked.size+' tài sản':'Cây tài sản • Cấp 1–N'}</div><div class="grid-footer-actions">${button('grid-edit',icon('edit')+' Sửa','btn small',ui.checked.size===1?'':'disabled')}${button('grid-add-child',icon('plus')+' Thêm cấp con','btn small',ui.checked.size===1?'':'disabled')}</div><div class="grid-pager"><label>Hiển thị <select id="grid-page-size" class="select">${[10,20,50,100].map(v=>`<option value="${v}" ${ui.gridPageSize===v?'selected':''}>${v}</option>`).join('')}</select></label><span>${a.length?start+1:0}–${Math.min(start+ui.gridPageSize,a.length)} / ${a.length}</span>${button('grid-prev','‹','btn small icon-only',ui.gridPage===1?'disabled':'')}${ui.gridPage} / ${maxPage}${button('grid-next','›','btn small icon-only',ui.gridPage>=maxPage?'disabled':'')}</div></div></div>
 <p class="grid-disclaimer">${icon('info',14)} Dữ liệu mô phỏng • Không chứa mã cẩu, serial, hồ sơ hay hình ảnh thực tế của khách hàng • Thay đổi chỉ lưu trên trình duyệt đang sử dụng.</p></div>`}
function detailMenu(type){let isCmp=type==='cmp',isChild=type==='loc'&&level(current().id)>1;return [['info','Thông tin chung','info'],['meters','Vận hành / Chỉ số','chart'],...(isCmp?[['equipment','Vị trí & luân chuyển','layers']]:[]),['work','Bảo trì / Work Order','clipboard'],['history',isCmp?'Lịch sử tháo/lắp & sửa chữa':'Lịch sử vị trí','history'],['cost',isCmp?'Chi phí vòng đời':'Chi phí bảo trì','cash'],['profile','Hồ sơ & ghi chú','suitcase']].map(([k,label,i])=>`<button type="button" class="detail-menu-item ${ui.detail===k||(k==='info'&&ui.detail==='assembly'&&type==='loc')?'active':''}" data-action="detail" data-id="${k}">${icon(i,17)}<span>${label}</span>${ui.detail===k||(k==='info'&&ui.detail==='assembly'&&type==='loc')?'<span class="active-chevron">›</span>':''}</button>`).join('')}
function detailField(k,value,wide=false){return `<div class="detail-field ${wide?'wide':''}"><label>${e(k)}</label><div class="value">${value===undefined||value===null||value===''?'—':value}</div></div>`}
function detailSectionTitle(text,iconName='info'){return `<div class="detail-section-title">${icon(iconName,16)}<b>${e(text)}</b></div>`}
function assetInfoContent(l){let lv=level(l.id),isRoot=lv===1,rootCrane=craneAtLocation(l.id)||node('crane'),units=installedAt(l.id);const regular=`${detailField('Mã kỹ thuật',e(l.code))}${detailField('Tên tài sản',e(l.name))}${detailField('Cấp quản lý',badge('Cấp '+lv,lv===1?'blue':lv===2?'gray':'green'))}${isRoot?detailField('Loại tài sản',e(nodeTitle(l))):''}${detailField('Tài sản cha',l.parentId?showLink('loc',l.parentId,locName(l.parentId)):'Không có (tài sản cấp 1)')}${detailField('Trạng thái hoạt động',badge('Hoạt động','green'))}${detailField('Đơn vị quản lý',e(isRoot?l.manager||'Đơn vị Demo':rootCrane.manager))}${detailField('Vị trí khai thác',e(isRoot?l.site||'Cảng Mẫu':rootCrane.site||'Cảng Mẫu'))}`;
 const rootFields=isRoot?`${detailSectionTitle('Thông tin nhận diện cẩu','crane')}<div class="detail-fields">${detailField('Model',e(l.model))}${detailField('Số khung / Serial',e(l.serial))}${detailField('Đơn vị sở hữu',e(l.owner))}${detailField('Hãng sản xuất',e(l.maker))}${detailField('Năm sản xuất',e(l.manufactureYear))}${detailField('Ngày đưa vào sử dụng',date(l.inService))}${detailField('Số đăng kiểm (Demo)',e(l.registration))}</div>`:'';
 const slots=l.kind==='gearbox-slot'||l.kind==='spreader-slot';return `${detailSectionTitle('Thông tin tài sản cấp '+lv,'info')}<div class="detail-fields">${regular}</div>${rootFields}${slots?`${detailSectionTitle('Vị trí đặt & thay thế','pin')}<div class="detail-fields">${detailField('Vị trí đặt',e(assemblyInstallPosition(l)))}${detailField('Serial đang sử dụng',e(units[0]?.serial||'Chưa có'))}</div><div class="detail-note">Tài sản <b>${e(l.code)} – ${e(l.name)}</b> thuộc <b>${e(assemblyInstallPosition(l))}</b>. Khi thay thế, hệ thống vẫn ghi nhận tháo/lắp, lịch sử theo vị trí và chi phí vòng đời từng thiết bị.</div><div class="detail-actions">${button('movement',icon('move')+' Ghi nhận tháo/lắp','btn primary',`data-slot="${e(l.id)}"`)}</div>`:''}${l.notes?`${detailSectionTitle('Ghi chú','clipboard')}<p class="detail-note">${e(l.notes)}</p>`:''}`}
function partStats(c){const ev=db.events.filter(x=>x.componentId===c.id),ws=db.workorders.filter(w=>w.componentId===c.id),cost=db.costs.filter(x=>x.componentId===c.id);return {ev,ws,cost,installed:ev.filter(x=>x.type==='install').length,removed:ev.filter(x=>x.type==='remove').length,repairs:ev.filter(x=>x.type==='send').length,total:cost.reduce((s,x)=>s+Number(x.amount||0),0)}}
function partMetrics(c){let k=partStats(c);return `<div class="lifecycle-kpis"><div><small>Số lần lắp</small><strong>${k.installed}</strong><span>Ghi nhận theo thiết bị</span></div><div><small>Số lần tháo</small><strong>${k.removed}</strong><span>Ghi nhận theo thiết bị</span></div><div><small>Đợt gửi sửa chữa</small><strong>${k.repairs}</strong><span>Xưởng / nhà cung cấp</span></div><div class="accent"><small>Tổng chi phí vòng đời</small><strong>${shortMoney(k.total)}</strong><span>${k.cost.length} khoản chi • VND</span></div></div>`}
function partEventLabel(ev){return EVENT_LABEL[ev.type]||ev.type}
function partEventPlace(ev){return ev.toLoc?`Lắp tại ${locName(ev.toLoc)}`:ev.fromLoc?`Tháo từ ${locName(ev.fromLoc)}`:ev.place||'Chưa rõ địa điểm'}
function partTimeline(c,limit=7){let a=partStats(c).ev.slice().sort((x,y)=>y.date.localeCompare(x.date)).slice(0,limit);return `<div class="lifecycle-stream">${a.length?a.map(ev=>`<div class="life-event ${e(ev.type)}"><span class="life-dot"></span><div class="life-body"><div class="life-event-head"><b>${e(partEventLabel(ev))}</b><time>${datetime(ev.date)}</time></div><div class="life-event-sub">${e(partEventPlace(ev))}</div><div class="life-event-crane">${icon('crane',13)} <span>${eventCraneLabel(ev)}:</span> ${eventCraneDisplay(ev)}</div>${ev.note?`<p>${e(publicNarrative(publicNarrative(ev.note)))}</p>`:''}${ev.woId?`<span class="life-wo">${icon('clipboard',13)} ${e(ev.woId)}</span>`:''}</div></div>`).join(''):'<div class="empty">Chưa ghi nhận giao dịch.</div>'}</div>`}
function partRecentCosts(c,limit=5){let a=partStats(c).cost.slice().sort((x,y)=>y.date.localeCompare(x.date)).slice(0,limit);return `<div class="life-cost-list">${a.length?a.map(x=>`<div class="life-cost-item"><div><b>${e(x.category)}</b><span>${date(x.date)} · ${e(publicNarrative(x.note||''))}</span>${x.woId?`<small>WO: ${e(db.workorders.find(w=>w.id===x.woId)?.code||x.woId)}</small>`:''}</div><strong>${money(x.amount)}</strong></div>`).join(''):'<div class="empty">Chưa phát sinh chi phí.</div>'}</div>`}
function partOverview(c){let k=partStats(c),wo=k.ws.slice().sort((a,b)=>b.date.localeCompare(a.date)),last=k.ev.slice().sort((a,b)=>b.date.localeCompare(a.date))[0];return `${detailSectionTitle('Tổng quan vòng đời thiết bị','layers')}${partMetrics(c)}<div class="life-context"><div>${icon('pin',17)} <b>Vị trí hiện tại:</b> ${e(c.place)}</div><div>${icon('history',17)} <b>Giao dịch gần nhất:</b> ${last?datetime(last.date)+' · '+e(partEventLabel(last)):'Chưa có'}</div><div>${icon('clipboard',17)} <b>Work Order:</b> ${wo.length} phiếu</div><div>${icon('cash',17)} <b>Quy tắc:</b> chi phí theo mã ${e(c.code)}, không nhân đôi khi tổng hợp theo cẩu</div></div><div class="life-two-col"><section class="life-card"><div class="life-card-head"><h3>${icon('history')} Tháo/lắp & sửa chữa gần đây</h3>${button('detail','Xem toàn bộ ›','btn small ghost','data-id="history"')}</div>${partTimeline(c,6)}</section><section class="life-card"><div class="life-card-head"><h3>${icon('cash')} Chi phí sửa chữa & bảo dưỡng</h3>${button('detail','Xem sổ chi phí ›','btn small ghost','data-id="cost"')}</div>${partRecentCosts(c,5)}<div class="life-card-foot"><span>Cộng toàn bộ khoản chi</span><strong>${money(k.total)}</strong></div></section></div><section class="life-card"><div class="life-card-head"><h3>${icon('clipboard')} Work Order liên quan</h3>${button('detail','Xem Work Order ›','btn small ghost','data-id="work"')}</div>${wo.length?`<div class="scroll-table"><table class="data-table"><thead><tr><th>Mã WO</th><th>Ngày</th><th>Nội dung</th><th>Trạng thái</th><th>Chi phí có WO</th></tr></thead><tbody>${wo.slice(0,4).map(w=>`<tr><td><b>${e(w.code)}</b></td><td>${date(w.date)}</td><td>${e(publicNarrative(w.title))}</td><td>${woBadge(w.status)}</td><td>${money(k.cost.filter(z=>z.woId===w.id).reduce((a,b)=>a+b.amount,0))}</td></tr>`).join('')}</tbody></table></div>`:'<div class="empty">Chưa có Work Order.</div>'}</section>`}
function componentInfoContent(c){let spot=node(c.locationId);return `${detailSectionTitle('Thông tin tài sản HGT / khung chụp','box')}<div class="detail-fields">${detailField('Mã tài sản',e(c.code))}${detailField('Tên thiết bị',e(c.name))}${detailField('Số serial',e(c.serial))}${detailField('Loại',badge(c.kind==='gearbox'?'Hộp giảm tốc / Rotable':'Khung chụp / Rotable','blue'))}${detailField('Trạng thái',statusBadge(c.status))}${detailField('Tình trạng kỹ thuật',e(c.condition))}${detailField('Vị trí đặt trên cẩu',spot?showLink('loc',spot.id,locName(spot.id)):'Chưa lắp')}${detailField('Địa điểm thực tế',e(c.place))}${detailField('Model',e(c.model))}${detailField('Hãng sản xuất',e(c.maker))}${detailField('Năm sản xuất',e(c.year))}</div>${partOverview(c)}${detailSectionTitle('Nguyên tắc quản lý','info')}<div class="detail-note">Mã thiết bị <b>${e(c.code)}</b> giữ nguyên khi tháo, gửi sửa chữa, nhập kho hoặc lắp cẩu khác. Lịch sử và chi phí luôn gắn với thiết bị vật lý, còn vị trí hiện tại được xác định theo lịch sử tháo/lắp.</div>${c.notes?`<div class="detail-note muted-note">${e(publicNarrative(publicNarrative(c.notes)))}</div>`:''}`}
function partHistoryContent(c){let k=partStats(c);return `${detailSectionTitle('Lịch sử tháo/lắp – sửa chữa: '+c.code,'history')}${partMetrics(c)}<div class="detail-note">Mục này chỉ dùng tra cứu. Nhật ký ghi nhận tự động khi xác nhận tháo, lắp, chuyển xưởng hoặc nghiệm thu từ Thiết bị luân chuyển hoặc Work Order. Mỗi sự kiện thuộc <b>${e(c.code)}</b> kể cả khi thiết bị không còn lắp trên cẩu.</div><div class="life-two-col"><section class="life-card"><div class="life-card-head"><h3>${icon('history')} Dòng thời gian đầy đủ</h3><span class="history-readonly-label">Chỉ xem</span></div>${partTimeline(c,999)}</section><section class="life-card"><div class="life-card-head"><h3>${icon('cash')} Chi phí theo thiết bị</h3><span class="history-readonly-label">Sổ chi phí tham chiếu</span></div>${partRecentCosts(c,999)}<div class="life-card-foot"><span>Chi phí vòng đời • ${k.cost.length} bút toán</span><strong>${money(k.total)}</strong></div></section></div>${detailSectionTitle('Sổ giao dịch tháo/lắp','clipboard')}${activityTable(k.ev,'Toàn bộ sự kiện • '+k.ev.length+' bản ghi')}`}
function partCostContent(c){let k=partStats(c),types=[...new Set(k.cost.map(x=>x.category))];return `${detailSectionTitle('Chi phí vòng đời của '+c.code,'cash')}<div class="life-total"><div><small>TỔNG CHI PHÍ SỬA CHỮA, BẢO DƯỠNG, VẬN CHUYỂN</small><strong>${money(k.total)}</strong><span>${k.cost.length} bút toán; ${k.ws.length} Work Order được liên kết</span></div>${button('new-cost',icon('plus')+' Ghi chi phí','btn primary',`data-id="${e(c.id)}"`)}</div><div class="life-type-grid">${types.map(t=>`<div><small>${e(t)}</small><b>${money(k.cost.filter(x=>x.category===t).reduce((a,x)=>a+x.amount,0))}</b></div>`).join('')}</div><div class="detail-note">Chi phí được ghi một lần theo mã thiết bị; WO chỉ là tham chiếu. Chi phí có vị trí hưởng phí vẫn không được nhân đôi khi xem báo cáo theo cẩu.</div>${costTable(k.cost,'Các khoản chi của '+c.code+' • '+money(k.total))}`}
function equipmentTable(cs,title='Danh mục thiết bị',readOnly=false){return `<div class="detail-panel"><div class="detail-panel-head"><div><h3>${icon('layers')} ${e(title)}</h3><p>Nhấn mã tài sản để mở hồ sơ vòng đời, lịch sử tháo/lắp, WO và chi phí.</p></div>${readOnly?'<span class="history-readonly-label">Chỉ xem</span>':button('new-component',icon('plus')+' Khai báo thiết bị','btn small')}</div><div class="scroll-table"><table class="data-table equipment-list"><thead><tr><th>Mã tài sản</th><th>Tên thiết bị</th><th>Serial</th><th>Trạng thái</th><th>Địa điểm hiện tại</th><th>Tháo / Lắp</th><th>Gửi sửa chữa</th><th>Chi phí vòng đời</th><th>Hồ sơ</th></tr></thead><tbody>${cs.length?cs.map(c=>{let k=partStats(c);return `<tr><td><b>${showLink('cmp',c.id,c.code)}</b></td><td>${e(c.name)}</td><td>${e(c.serial||'—')}</td><td>${statusBadge(c.status)}</td><td>${e(c.place)}</td><td>${k.removed} / ${k.installed}</td><td>${k.repairs}</td><td><b>${money(k.total)}</b></td><td>${button('select-cmp',icon('eye',15),'btn small icon-only',`data-id="${e(c.id)}" title="Xem lịch sử và chi phí của thiết bị"`)}</td></tr>`}).join(''):'<tr><td colspan="9" class="muted">Chưa có thiết bị luân chuyển liên quan.</td></tr>'}</tbody></table></div></div>`}
function equipmentContent(obj,type){if(type==='cmp'){let c=obj,events=db.events.filter(v=>v.componentId===c.id),places=events.filter(v=>v.toLoc||v.fromLoc);return `${detailSectionTitle('Tình trạng & vị trí hiện tại','pin')}<div class="detail-fields">${detailField('Mã tài sản',e(c.code))}${detailField('Trạng thái',statusBadge(c.status))}${detailField('Địa điểm thực tế',e(c.place))}${detailField('Vị trí đặt hiện tại',c.locationId?showLink('loc',c.locationId,locName(c.locationId)):'Chưa lắp')}${detailField('Số lần tháo / lắp',String(countOps(c.id)))}${detailField('Số lần gửi sửa chữa',String(events.filter(v=>v.type==='send').length))}</div>${detailSectionTitle('Lịch sử sử dụng vị trí','history')}<div class="detail-note">${places.length?'Thiết bị được theo dõi qua toàn bộ các vị trí đã lắp/tháo; mã thiết bị không đổi.':'Chưa có lịch sử lắp đặt.'}</div>${timeline(places,30)}<div class="detail-actions">${button('movement',icon('move')+' Tạo giao dịch tháo/lắp','btn primary',`data-id="${e(c.id)}"`)}</div>`}
 let cs=scopedComponents(obj.id),slots=db.locations.filter(x=>subtreeIds(obj.id).includes(x.id)&&(x.kind==='gearbox-slot'||x.kind==='spreader-slot'));return `<div class="detail-stat-row"><div><small>Thiết bị liên quan</small><strong>${cs.length}</strong></div><div><small>Đang lắp trong nhánh</small><strong>${cs.filter(c=>c.locationId&&subtreeIds(obj.id).includes(c.locationId)).length}</strong></div><div><small>Vị trí kỹ thuật có thể lắp</small><strong>${slots.length}</strong></div></div>${equipmentTable(cs,'Thiết bị luân chuyển thuộc nhánh '+obj.code)}<div class="detail-note">Nhấn vào mã thiết bị để xem <b>lịch sử tháo/lắp + sửa chữa + Work Order + tổng chi phí</b> của riêng HGT hoặc Spreader đó, kể cả khi đã tháo khỏi cẩu.</div>${detailSectionTitle('Các vị trí có thể lắp thiết bị','pin')}<div class="slot-list">${slots.map(l=>`<div class="slot-row"><div><b>${showLink('loc',l.id,l.code+' · '+l.name)}</b><small>${e(nodeTitle(l))}</small></div>${installedAt(l.id).length?installedAt(l.id).map(c=>showLink('cmp',c.id,c.code)).join(', '):badge('Vị trí trống','amber')}${button('movement',icon('move')+' Tháo/lắp','btn small',`data-slot="${e(l.id)}"`)}</div>`).join('')||'<div class="detail-note">Nhánh này chưa có vị trí tháo rời.</div>'}</div>`}
// Cấp 1: tab Cụm lắp ráp là cây vị trí đặt; không phải danh mục thiết bị vật lý.
function assemblySlots(craneId=''){return db.locations.filter(x=>['gearbox-slot','spreader-slot'].includes(x.kind)&&(!craneId||craneAtLocation(x.id)?.id===craneId))}
function assemblyInstallPosition(l){if(!l)return '—';if(l.kind==='spreader-slot')return 'Khung chụp';if(l.kind==='gearbox-slot')return node(l.parentId)?.name||'Chưa xác định';return '—'}
function assemblyRows(){
 const out=[];
 function walk(loc,depth){
  for(const x of child(loc.id)){
   const kids=child(x.id),opened=ui.assemblyExpanded.has(x.id),selected=ui.assemblySelected===x.id,
     isSlot=['gearbox-slot','spreader-slot'].includes(x.kind);
   out.push(`<tr class="assembly-row ${selected?'selected':''}" data-depth="${depth}">
     <td class="assembly-check"><input aria-label="Chọn ${e(x.code)}" type="radio" name="assembly-choice" value="${e(x.id)}" data-assembly-choice="${e(x.id)}" ${selected?'checked':''}></td>
     <td class="assembly-structure"><div class="assembly-tree" style="--assembly-depth:${depth}">
       ${kids.length?button('assembly-expand',opened?icon('down',15):'›','assembly-arrow',`data-id="${e(x.id)}" title="Mở/thu gọn nhánh"`):'<span class="assembly-arrow-space"></span>'}
       <span class="assembly-typeicon">${icon(isSlot?(x.kind==='gearbox-slot'?'gear':'layers'):kids.length?'asset':'box',17)}</span>
       ${button('assembly-select',e(x.code),'assembly-code',`data-id="${e(x.id)}"`)}</div></td>
     <td>${button('assembly-select',e(x.name),'assembly-name',`data-id="${e(x.id)}"`)}</td>
     <td>${isSlot?`<span class="assembly-install-pos">${icon('pin',14)} ${e(assemblyInstallPosition(x))}</span>`:'—'}</td>
   </tr>`);
   if(kids.length&&opened)walk(x,depth+1);
  }
 }
 walk(craneAtLocation(current().id)||node('crane'),0);
 return out.join('');
}
function assemblyContent(){
 const selected=node(ui.assemblySelected),canReplace=selected&&['gearbox-slot','spreader-slot'].includes(selected.kind);
 return `<div class="assembly-view">
   <div class="assembly-toolbar"><div><h2>${icon('layers',19)} Cụm lắp ráp</h2><p>Chọn tài sản HGT / Khung chụp để thay thế; vị trí đặt được xác định theo tài sản cha.</p></div>
   <div class="assembly-tools">${button('assembly-open-all',icon('down')+' Mở tất cả','btn small')}${button('assembly-close-all',icon('up')+' Thu gọn','btn small')}${button('assembly-replace',icon('move')+' Thay thế','btn small primary',canReplace?'':'disabled title="Chọn một tài sản HGT hoặc khung chụp"')}</div></div>
   <div class="assembly-selection">${canReplace?`<span>${icon('gear',15)} <b>Tài sản:</b> ${e(selected.code)} – ${e(selected.name)}</span><span>${icon('pin',15)} <b>Vị trí đặt:</b> ${e(assemblyInstallPosition(selected))}</span>`:'Chọn tài sản HGT hoặc khung chụp trong cây để thực hiện thay thế.'}</div>
   <div class="assembly-scroller"><table class="assembly-table"><thead><tr><th style="width:40px"></th><th>Cấu trúc</th><th>Tên tài sản</th><th>Vị trí đặt</th></tr></thead><tbody>${assemblyRows()}</tbody></table></div>
   <div class="assembly-footer">${icon('info',14)} Mỗi dòng HGT / Khung chụp là tài sản đang quản lý. Thay thế vẫn ghi nhận lịch sử của tài sản tại vị trí đặt và lịch sử, chi phí riêng của từng thiết bị thực tế.</div>
 </div>`;
}
function replacementCostChoices(slot,old,newUnit){
 const label=c=>`${c.code} – ${c.name}${c.serial?' · '+c.serial:''}`;
 // Current physical unit stays identifiable by serial in the back-end.
 // No separate 'tracking code before replacement' field in the visible form.
 const oldLabel=old?(slot?slot.code+' – '+slot.name:'Hộp giảm tốc / Khung chụp')+(old.serial?' · '+old.serial:''):'';
 return [...(old?[{value:old.id,label:oldLabel}]:[]),...(newUnit?[{value:newUnit.id,label:label(newUnit)}]:[])];
}
function replacementCostFields(old,newUnit,slot=null){
 const options=replacementCostChoices(slot,old,newUnit);
 return `<div class="replacement-cost-box"><div class="wo-panel-title">${icon('cash')} Chi phí phát sinh khi thay thế <span class="replacement-cost-optional">(tùy chọn)</span></div>
 <div class="form-grid">${field('costAmount','Số tiền phát sinh (VND)','','number','min="1" step="1" placeholder="Để trống nếu chưa phát sinh"')}
 ${selectField('costComponent','Hộp giảm tốc / Khung chụp chịu chi phí',options,options[0]?.value||'','required','— Chọn hộp chịu chi phí —')}
 ${selectField('costCategory','Loại chi phí',[{value:'Sửa chữa',label:'Sửa chữa'},{value:'Bảo dưỡng',label:'Bảo dưỡng'},{value:'Vận chuyển',label:'Vận chuyển'},{value:'Khác',label:'Khác'}],'Sửa chữa','required')}
 ${field('costNote','Diễn giải chi phí','','text','maxlength="250" placeholder="Vật tư, nhân công, vận chuyển..."')}</div>
 <div class="form-hint">Chọn đúng <b>hộp / khung chụp</b> chịu chi phí theo mã và serial. Mỗi lần thay thế ghi tối đa một khoản chi; khoản chi vẫn tra cứu được từ cẩu, hồ sơ thiết bị và WO (nếu có).</div></div>`;
}
function refreshReplacementCostSelector(form,slot){
 if(!form)return;
 const old=slot?installedAt(slot.id)[0]:null;
 const newUnit=comp(form.elements.replacementId?.value);
 const field=form.elements.costComponent,prev=field?.value;
 if(!field)return;
 const items=replacementCostChoices(slot,old,newUnit);
 field.innerHTML=items.map(x=>`<option value="${e(x.value)}">${e(x.label)}</option>`).join('');
 field.value=items.some(x=>x.value===prev)?prev:(items[0]?.value||'');
}
function prepareReplacementCost(g,slot,old,newUnit,at,woCode){
 const raw=g('costAmount');
 if(!raw)return {cost:null};
 if(!/^\d+$/.test(raw)||!Number.isSafeInteger(Number(raw))||Number(raw)<=0)
  return {error:'Chi phí phải là số nguyên VND lớn hơn 0, hoặc để trống nếu không phát sinh.'};
 const target=g('costComponent'),owner=[old,newUnit].find(c=>c&&c.id===target)||null;
 if(!owner)return {error:'Chọn đúng hộp giảm tốc / khung chụp chịu chi phí.'};
 const category=g('costCategory');
 if(!['Sửa chữa','Bảo dưỡng','Vận chuyển','Khác'].includes(category))return {error:'Loại chi phí không hợp lệ.'};
 const day=at.slice(0,10);
 if(!/^\d{4}-\d{2}-\d{2}$/.test(day))return {error:'Ngày phát sinh chi phí không hợp lệ.'};
 return {cost:{id:ident('C'),date:day,componentId:owner.id,woId:woCode||'',locationId:slot.id,
  category,amount:Number(raw),note:g('costNote')||g('note')||'Chi phí thay thế tại '+slot.code}};
}
function openReplacement(initialSlot){
 const slots=assemblySlots(),slot=node(initialSlot),eligible=slot&&slots.some(x=>x.id===slot.id);
 if(!eligible){toast('Vui lòng chọn tài sản HGT hoặc khung chụp trong cây.',true);return}
 const installed=installedAt(slot.id)[0];
 const available=db.components.filter(c=>c.status==='warehouse'&&!c.locationId&&isCompatible(c,slot));
 if(!available.length){toast('Không có thiết bị dự phòng tương thích, đang sẵn sàng trong kho.',true);return}
 modal('Thay thế hộp giảm tốc / khung chụp',`<form id="modal-form" data-form="replacement"><div class="notice green">Bạn đang thay <b>tài sản HGT / Khung chụp</b> đã chọn trong cây. Hệ thống ghi nhận tháo thiết bị cũ và lắp thiết bị mới tại cùng vị trí thuộc tài sản cha; lịch sử và chi phí từng thiết bị được giữ nguyên.</div>
 <div class="form-grid">
 ${selectField('target','Tài sản cần thay thế <span class="req">*</span>',slots.map(x=>({value:x.id,label:x.code+' · '+x.name+' — Vị trí đặt: '+assemblyInstallPosition(x)})),slot.id,'required')}
 ${selectField('replacementId','Hộp giảm tốc / Khung chụp thay vào <span class="req">*</span>',available.map(x=>({value:x.id,label:x.code+' · '+x.name+' · '+x.serial})),available[0]?.id||'','required')}
 ${selectField('place','Nơi chuyển thiết bị tháo ra',placeOptions,'Kho kỹ thuật')}
 ${field('at','Thời điểm thực hiện <span class="req">*</span>',stamp(),'datetime-local','required')}
 ${selectField('woId','Work Order tham chiếu (nếu có)',db.workorders.map(w=>({value:w.code,label:w.code+' · '+publicNarrative(w.title)})),'','','— Không tham chiếu —')}
 <div class="form-field wide">${field('note','Diễn giải / lý do thay thế','','textarea','placeholder="Ví dụ: Thay hộp giảm tốc để bảo dưỡng, thiết bị cũ chuyển xuống xưởng..."')}</div>
 </div>${replacementCostFields(installed,available[0],slot)}<div class="notice" id="replacement-hint">Chỉ thiết bị cùng loại, đang ở kho và sẵn sàng lắp mới được chọn. Nếu thiết bị cũ vẫn lắp, hệ thống ghi nhận tháo trước, lắp sau.</div></form>`,submitButtons('Xác nhận thay thế'));
 updateReplacementHint();
}
function updateReplacementHint(){
 const form=document.querySelector('#modal-form[data-form="replacement"]');if(!form)return;
 const slot=node(form.elements.target.value),old=slot?installedAt(slot.id)[0]:null,
  eligible=db.components.filter(c=>slot&&c.status==='warehouse'&&!c.locationId&&isCompatible(c,slot));
 const selector=form.elements.replacementId,previous=selector.value;
 selector.innerHTML=eligible.map(c=>`<option value="${e(c.id)}">${e(c.code+' · '+c.name+' · '+c.serial)}</option>`).join('');
 if(eligible.some(c=>c.id===previous))selector.value=previous;
 refreshReplacementCostSelector(form,slot);
 const placeGroup=form.elements.place.closest('.form-field');placeGroup.classList.toggle('hide',!old);
 const hint=document.getElementById('replacement-hint');
 if(hint)hint.textContent=eligible.length?`Vị trí ${slot?.code||''}: ${old?'Tháo '+old.code+', sau đó lắp thiết bị dự phòng.':'Lắp vào vị trí đang trống.'} Nhật ký sẽ cập nhật tự động.`:'Không có thiết bị dự phòng tương thích đang trong kho.';
}
function recordReplacement(g,fromWO=false){
 const slot=node(g('target')),newUnit=comp(g('replacementId')),at=g('at'),place=g('place'),note=g('note')||'Thay thế thiết bị tại vị trí đặt',woCode=g('woId');
 if(!slot||!['gearbox-slot','spreader-slot'].includes(slot.kind)||!assemblySlots().some(x=>x.id===slot.id))return 'Vị trí đặt không hợp lệ.';
 if(!newUnit||newUnit.status!=='warehouse'||newUnit.locationId||!isCompatible(newUnit,slot))return 'Chỉ được lắp thiết bị dự phòng tương thích, đang sẵn sàng trong kho.';
 if(!at)return 'Cần chọn thời điểm thay thế.';
 const linkedWO=woCode?db.workorders.find(w=>w.code===woCode):null;
 if(woCode&&!linkedWO)return 'Work Order tham chiếu không tồn tại.';
 if(!fromWO&&linkedWO?.locationId&&linkedWO.locationId!==slot.id)return 'Work Order thuộc vị trí khác. Chọn đúng WO hoặc không tham chiếu.';
 const old=installedAt(slot.id)[0];
 if(old&&old.id===newUnit.id)return 'Không được thay bằng chính thiết bị đang lắp.';
 const costResult=prepareReplacementCost(g,slot,old,newUnit,at,woCode);
 if(costResult.error)return costResult.error;
 const removeWO=linkedWO&&(fromWO||!linkedWO.componentId||linkedWO.componentId===old?.id)?woCode:'';
 const installWO=linkedWO&&(fromWO||!linkedWO.componentId||linkedWO.componentId===newUnit.id)?woCode:'';
 if(linkedWO?.componentId&&!removeWO&&!installWO)return 'WO đã gắn với thiết bị khác, không thuộc lượt thay thế này.';
 let removal=null,prev=null;
 if(old){
  removal=prepareMovement(old.id,'remove','',place,at,note,removeWO);
  if(removal.error)return removal.error;
  prev={...old};
  Object.assign(old,removal.change); // Kiểm tra bước lắp với vị trí giả lập vừa được tháo
 }
 const installAt=old?new Date(new Date(at).getTime()+60000):new Date(at);
 const installDate=Number.isNaN(installAt.getTime())?'':`${installAt.getFullYear()}-${String(installAt.getMonth()+1).padStart(2,'0')}-${String(installAt.getDate()).padStart(2,'0')}T${String(installAt.getHours()).padStart(2,'0')}:${String(installAt.getMinutes()).padStart(2,'0')}`;
 let installation;
 try{installation=prepareMovement(newUnit.id,'install',slot.id,'',installDate,note,installWO)}finally{if(old)Object.assign(old,prev)}
 if(installation.error)return installation.error;
 const replacementRef=ident('RP');
 if(removal){removal.event.replacementRef=replacementRef;commitMovement(removal)}
 installation.event.replacementRef=replacementRef;
 commitMovement(installation);
 if(costResult.cost)db.costs.push({...costResult.cost,replacementRef});
 ui.assemblySelected=slot.id;path(slot.id).forEach(x=>ui.assemblyExpanded.add(x.id));
 return '';
}

function meterFormat(v){return Number(v||0).toLocaleString('vi-VN',{maximumFractionDigits:2})}
function meterCurrentOwner(){
 const sel=current();
 if(sel.type==='cmp')return {ownerType:'cmp',ownerId:sel.id,asset:comp(sel.id),choices:[]};
 const n=node(sel.id);
 if(n&&(n.kind==='gearbox-slot'||n.kind==='spreader-slot')){
  const units=scopedComponents(sel.id).filter(c=>c.kind===(n.kind==='spreader-slot'?'spreader':'gearbox'));
  const chosen=units.find(c=>c.id===ui.meterComponentId)||installedAt(sel.id)[0]||units[0]||null;
  return {ownerType:'cmp',ownerId:chosen?.id||'',asset:chosen,choices:units,slot:n};
 }
 return {ownerType:'loc',ownerId:sel.id,asset:n,choices:[]};
}
function meterDefinitionsFor(owner){return db.meterDefs.filter(d=>d.ownerType===owner.ownerType&&d.ownerId===owner.ownerId)}
function meterReadings(def){return db.meterEntries.filter(x=>x.defId===def.id).sort((a,b)=>a.at.localeCompare(b.at))}
function meterPositionAt(componentId,at){
  const moves=db.events.filter(v=>v.componentId===componentId&&v.date<=at&&['install','remove','send','complete'].includes(v.type)).sort((a,b)=>a.date.localeCompare(b.date));
  const last=moves[moves.length-1];
  return last?.type==='install'?last.toLoc||'':null;
}
function meterView(){
 const owner=meterCurrentOwner(),obj=owner.asset;
 if(!obj)return '<div class="detail-note">Chưa có thiết bị gắn với vị trí này. Vào hồ sơ tài sản tương ứng để theo dõi chỉ số.</div>';
 const defs=meterDefinitionsFor(owner),selected=defs.find(d=>d.id===ui.meterDefId)||defs[0];
 const records=selected?meterReadings(selected):[],latest=records[records.length-1],meta=selected?METER_KINDS[selected.kind]:null;
 let choices=owner.choices.length?`<div class="meter-asset-picker"><label for="meter-component-select">Chọn hộp / khung chụp cần xem</label><select class="select" id="meter-component-select">${owner.choices.map(c=>`<option value="${e(c.id)}" ${c.id===owner.ownerId?'selected':''}>${e(c.code)} · ${e(c.name)} · ${e(c.serial||'Không serial')}</option>`).join('')}</select></div>`:'';
 return `<div class="meter-panel">${detailSectionTitle('Thông số vận hành','chart')}
 <div class="meter-intro">Chỉ số được lưu theo <b>${e(obj.code)} – ${e(obj.name)}</b> (${owner.ownerType==='cmp'?'thiết bị xuyên suốt vòng đời':'tài sản kỹ thuật'}). ${owner.ownerType==='cmp'?'<b>Không đặt về 0 khi tháo khỏi cẩu, gửi bảo dưỡng hoặc chuyển sang cẩu khác.</b>':'Chỉ số của cẩu không tự cộng hai lần từ số liệu khung chụp.'}</div>
 ${choices}
 <div class="meter-def-header"><b>Danh sách chỉ số</b>${button('meter-new-def',icon('plus')+' Thêm chỉ số','btn small')}</div>
 <div class="meter-list-scroll"><table class="data-table meter-def-table"><thead><tr><th>Chỉ số</th><th>Đơn vị</th><th>Giá trị lũy kế</th><th>Ghi gần nhất</th></tr></thead><tbody>
 ${defs.map(d=>{let entries=meterReadings(d),last=entries[entries.length-1],type=METER_KINDS[d.kind];return `<tr class="${selected?.id===d.id?'meter-selected':''}"><td>${button('meter-select',e(type.name),'meter-select-btn',`data-id="${e(d.id)}"`)}</td><td>${e(type.unit)}</td><td><strong>${meterFormat(last?.total)}</strong></td><td>${last?datetime(last.at):'—'}</td></tr>`}).join('')||'<tr><td colspan="4">Chưa có chỉ số.</td></tr>'}
 </tbody></table></div>
 ${selected?`<div class="meter-reading-header"><div><h3>${icon('history')} Lịch sử ${e(meta.name.toLowerCase())}</h3><small>Lịch sử ghi giá trị lũy kế theo từng cẩu, không làm mất sản lượng khi đảo chuyển.</small></div>${button('meter-new-reading',icon('plus')+' Ghi chỉ số','btn primary small',`data-id="${e(selected.id)}"`)}</div>
 <div class="meter-total-box"><div><small>Giá trị lũy kế hiện tại</small><strong>${meterFormat(latest?.total)} <span>${e(meta.unit)}</span></strong></div><div><small>Số lần ghi</small><strong>${records.length}</strong></div><div><small>Lần cập nhật gần nhất</small><strong class="meter-datetime">${latest?datetime(latest.at):'—'}</strong></div></div>
 <div class="meter-list-scroll"><table class="data-table"><thead><tr><th>Thời điểm</th><th>${e(meta.name)}</th><th>Cẩu tại thời điểm ghi</th><th>Ghi chú</th></tr></thead><tbody>${records.slice().reverse().map(r=>`<tr><td>${datetime(r.at)}</td><td><strong>${meterFormat(r.total)}</strong></td><td>${r.craneCode?`${e(r.craneCode)}${r.craneName?' – '+e(r.craneName):''}`:'Không lắp trên cẩu'}</td><td>${e(r.note||'—')}</td></tr>`).join('')||'<tr><td colspan="4">Chưa ghi chỉ số vận hành.</td></tr>'}</tbody></table></div>`:''}
 </div>`;
}
function openMeterDefinition(){
 const owner=meterCurrentOwner();if(!owner.asset)return fail('Không có tài sản để khai báo chỉ số.');
 const exists=new Set(meterDefinitionsFor(owner).map(d=>d.kind));const available=Object.entries(METER_KINDS).filter(([kind])=>!exists.has(kind)).map(([value,x])=>({value,label:x.name+' ('+x.unit+')'}));
 if(!available.length)return toast('Tài sản này đã có đủ 3 loại chỉ số.');
 modal('Thêm thông số vận hành',`<form id="modal-form" data-form="meter-def"><input type="hidden" name="ownerType" value="${e(owner.ownerType)}"><input type="hidden" name="ownerId" value="${e(owner.ownerId)}"><div class="notice">Chọn thông số áp dụng cho ${e(owner.asset.code)}. Khung chụp giữ chỉ số riêng khi tháo/lắp luân chuyển.</div>${selectField('kind','Loại chỉ số',available,available[0].value,'required')}</form>`,submitButtons('Lưu chỉ số'));
}
function openMeterReading(id){
 const def=db.meterDefs.find(d=>d.id===id);if(!def)return fail('Không tìm thấy chỉ số.');
 const owner=meterCurrentOwner();if(def.ownerId!==owner.ownerId||def.ownerType!==owner.ownerType)return fail('Chỉ số không thuộc tài sản đang xem.');
 const readings=meterReadings(def),last=readings[readings.length-1];const meta=METER_KINDS[def.kind];
 modal('Ghi chỉ số vận hành',`<form id="modal-form" data-form="meter-reading"><input type="hidden" name="defId" value="${e(id)}"><div class="notice green">${e(owner.asset.code)} · ${e(meta.name)} (${e(meta.unit)}). Giá trị hiện tại: <strong>${meterFormat(last?.total)}</strong>. Khung chụp chuyển cẩu không mất số lũy kế.</div><div class="form-grid">${field('at','Thời điểm ghi *',stamp(),'datetime-local','required')}${selectField('mode','Kiểu ghi',[{value:'total',label:'Nhập giá trị lũy kế mới'},{value:'increment',label:'Nhập sản lượng / số phát sinh thêm'}],'total','required')}${field('value','Giá trị *','','number','required min="0" step="0.01" max="99999999999"')}${field('note','Ghi chú','','text','maxlength="250"')}</div><div class="form-hint">Ví dụ: đã ghi 100.000 lượt, phát sinh thêm 15.000 lượt → tổng mới 115.000. Khi nhập "lũy kế mới", điền 115000; khi nhập "phát sinh thêm", điền 15000.</div></form>`,submitButtons('Lưu chỉ số'));
}
function recordMeterReading(formGet){
 const def=db.meterDefs.find(d=>d.id===formGet('defId'));if(!def)return 'Chỉ số không tồn tại.';
 const at=formGet('at'),mode=formGet('mode'),raw=formGet('value'),value=Number(raw);let last=meterReadings(def).at(-1);
 if(!at||isNaN(Date.parse(at))||at.length<16)return 'Thời điểm không hợp lệ.';
 if(at>stamp())return 'Không ghi chỉ số trong tương lai.';
 if(last&&at<=last.at)return 'Thời điểm phải sau lần ghi gần nhất.';
 if(!raw||!Number.isFinite(value)||value<0||value>99999999999||!['total','increment'].includes(mode))return 'Giá trị chỉ số không hợp lệ.';
 const previous=Number(last?.total||0),total=mode==='increment'?previous+value:value,delta=total-previous;
 if(!Number.isFinite(total)||delta<0||total>99999999999)return 'Chỉ số lũy kế không được giảm. Nếu cần hiệu chỉnh, hãy xử lý bằng nghiệp vụ điều chỉnh riêng.';
 const locationId=def.ownerType==='cmp'?meterPositionAt(def.ownerId,at):(node(def.ownerId)?def.ownerId:null);
 const crane=locationId?craneAtLocation(locationId):null;
 // A spreader produces lifts only while attached to an operating crane; its baseline can be entered once in inventory.
 if(def.kind==='production'&&def.ownerType==='cmp'&&comp(def.ownerId)?.kind==='spreader'&&!locationId&&delta>0&&last)return 'Khung chụp chưa lắp cẩu tại thời điểm này, không thể tăng sản lượng.';
 db.meterEntries.push({id:ident('MR'),defId:def.id,ownerType:def.ownerType,ownerId:def.ownerId,at,previous,delta,total,mode,locationId:locationId||null,craneId:crane?.id||'',craneCode:crane?.code||'',craneName:crane?.name||'',note:formGet('note')});
 return '';
}
function detailContent(){let cur=current(),obj=cur.object;if(!obj)return '<div class="empty">Không tìm thấy tài sản.</div>';let isCmp=cur.type==='cmp',id=cur.id;
 if(ui.detail==='meters')return meterView();
 if(ui.detail==='info')return isCmp?componentInfoContent(obj):assetInfoContent(obj);
 if(ui.detail==='assembly'&&cur.type==='loc'&&level(id)===1)return assemblyContent();
 if(ui.detail==='equipment')return !isCmp&&level(id)>1?assetInfoContent(obj):equipmentContent(obj,cur.type);
 if(ui.detail==='work')return woTable(isCmp?db.workorders.filter(w=>w.componentId===id):scopedWOs(id),`Work Order liên quan · ${obj.code}`);
 if(ui.detail==='history'){if(isCmp)return partHistoryContent(obj);let events=scopedEvents(id);return `<div class="detail-note">Mục này chỉ dùng xem lịch sử, không tạo giao dịch tại đây. Nhấn mã tài sản để mở lịch sử xuyên suốt vòng đời của thiết bị, kèm sửa chữa và chi phí. Nhật ký vị trí dưới đây chỉ phản ánh những giao dịch phát sinh trong nhánh tài sản.</div>${activityTable(events,(level(id)>1?'Lịch sử vị trí · ':'Nhật ký tháo/lắp & luân chuyển · ')+events.length+' giao dịch',true)}${equipmentTable(scopedComponents(id),'Hồ sơ thiết bị có lịch sử trong nhánh',true)}`}
 if(ui.detail==='cost'){if(isCmp)return partCostContent(obj);let cs=scopedCosts(id),total=cs.reduce((a,b)=>a+b.amount,0);return `<div class="detail-stat-row"><div><small>Chi phí phân bổ theo vị trí</small><strong>${shortMoney(total)}</strong></div><div><small>Số bút toán</small><strong>${cs.length}</strong></div><div><small>Phạm vi</small><strong>Nhánh kỹ thuật</strong></div></div>${costTable(cs,'Sổ chi phí · '+money(total),true)}${equipmentTable(scopedComponents(id),'Chi phí vòng đời theo từng thiết bị liên quan')}`}
 return `${detailSectionTitle('Hồ sơ và ghi chú','suitcase')}<div class="detail-fields">${detailField('Mã',e(obj.code))}${detailField('Tên',e(obj.name))}${detailField('Hồ sơ mẫu',badge('Không đính kèm tài liệu thật','blue'))}${detailField('Ghi chú',e(obj.notes||'Chưa có'),true)}</div><div class="detail-note">Bản demo Public Safe không lưu ảnh, QR mã thật, biên bản sửa chữa, tài liệu kỹ thuật hoặc dữ liệu khách hàng. Có thể bổ sung luồng đính kèm khi phát triển hệ thống thực tế.</div>`}
function detailScreen(){const cur=current(),obj=cur.object;if(!ui.detailOpen||!obj)return '';let isCmp=cur.type==='cmp',lv=isCmp?'Thiết bị vật lý':'Cấp '+level(obj.id),kind=isCmp?'Rotable / Repairable':nodeTitle(obj),parent=isCmp?(obj.locationId?node(obj.locationId):null):(obj.parentId?node(obj.parentId):null);return `<section class="detail-screen" aria-label="Thông tin tài sản"><div class="detail-topline"><b>${icon('layers')} Thông tin tài sản</b><div class="detail-top-buttons">${button('detail-back',icon('down')+' Danh sách tài sản','detail-back-btn')}${button('detail-close',icon('close',19),'detail-close-btn','aria-label="Đóng chi tiết"')}</div></div><div class="detail-layout"><aside class="detail-left"><div class="detail-identity"><span class="detail-identicon">${icon(isCmp?(obj.kind==='gearbox'?'gear':'layers'):obj.kind==='crane'?'crane':'asset',40)}</span><b>${e(obj.code)}</b><small>${e(obj.name)}</small>${badge(lv,'blue')}</div><nav class="detail-side-nav">${detailMenu(cur.type)}</nav><div class="detail-left-caption">${icon('check',15)} Dữ liệu mô phỏng (Public Safe)</div></aside><main class="detail-main"><div class="detail-title-row"><div class="detail-breadcrumb">${button('detail-close','Danh sách tài sản','crumb-link')}<span>›</span>${!isCmp&&parent?showLink('loc',parent.id,parent.name):isCmp&&parent?showLink('loc',parent.id,parent.name):''}<span>›</span><strong>${e(obj.code)}</strong></div>${!isCmp&&level(obj.id)===1?`<div class="crane-top-tabs" role="tablist" aria-label="Chi tiết tài sản cấp 1">${button('crane-tab','Thông tin chung',`crane-top-tab ${ui.detail==='info'?'active':''}`,'data-id="info" role="tab" aria-selected="'+(ui.detail==='info')+'"')}${button('crane-tab','Cụm lắp ráp',`crane-top-tab ${ui.detail==='assembly'?'active':''}`,'data-id="assembly" role="tab" aria-selected="'+(ui.detail==='assembly')+'"')}</div>`:''}<div class="detail-title-inner"><div><div class="detail-subtitle">${e(isCmp?kind.toUpperCase():level(obj.id)>1?'CẤP '+level(obj.id):kind.toUpperCase())}</div><h1>${e(obj.name)}</h1><p>${e(obj.code)} · ${isCmp?e(obj.serial||'Chưa có serial'):'Cấu trúc tài sản dạng cha – con'}</p></div><div class="detail-title-actions">${button(isCmp?'edit-component':'edit-node',icon('edit')+' Sửa','btn small',`data-id="${e(obj.id)}"`)}${button('new-wo',icon('clipboard')+' Tạo WO','btn small',isCmp?`data-id="${e(obj.id)}"`:`data-slot="${e(obj.id)}"`)}${button('detail-close','Đóng','btn small')}</div></div></div><div class="detail-content-scroll"><div class="detail-content-card">${detailContent()}</div></div><div class="detail-bottomline"><span>${icon('info',14)} ${e(kind)} • ${e(obj.code)} • Dữ liệu mô phỏng</span><div>${isCmp?button('movement',icon('move')+' Tháo/lắp / chuyển xưởng','btn small primary',`data-id="${e(obj.id)}"`):button('new-node',icon('plus')+' Thêm tài sản con','btn small',`data-parent="${e(obj.id)}"`)}${button('detail-close',icon('check')+' Hoàn tất','btn small primary')}</div></div></main></div></section>`}

// v1.4.6: Full-screen Work Order detail. Replacement uses the existing movement ledger.
function openWODetail(id,tab='info'){
 const w=db.workorders.find(x=>x.id===id);
 if(!w){toast('Không tìm thấy công việc.',true);return}
 ui.woId=id;ui.woOpen=true;ui.woTab=['info','execution','staff','materials','discussion','documents','log','replacement'].includes(tab)?tab:'info';
 const preferred=node(w.locationId)?.kind?.endsWith('-slot')?w.locationId:comp(w.componentId)?.locationId;
 if(preferred&&assemblySlots().some(l=>l.id===preferred))ui.woReplacementSlot=preferred;
 else if(!assemblySlots().some(l=>l.id===ui.woReplacementSlot))ui.woReplacementSlot=assemblySlots()[0]?.id||'';
 render();
}
function workInfoLine(label,value){return `<div class="wo-info-cell"><small>${e(label)}</small><div>${value||'—'}</div></div>`}
function workDetailInfo(w){
 const c=comp(w.componentId),l=node(w.locationId),events=db.events.filter(ev=>ev.woId===w.code),costs=db.costs.filter(z=>z.woId===w.id);
 return `<div class="wo-detail-columns"><div class="wo-detail-left">
  <div class="wo-panel"><div class="wo-panel-title">${icon('info')} Thông tin chung</div>
    <div class="wo-info-grid">${workInfoLine('Mã công việc',e(w.code))}${workInfoLine('Loại công việc',e(w.type))}${workInfoLine('Ngày tạo',date(w.date))}${workInfoLine('Trạng thái',woBadge(w.status))}</div>
    <div class="wo-panel-title wo-inner-heading">${icon('clipboard')} Nội dung công việc</div><div class="wo-description">${e(publicNarrative(w.description||w.title))}</div>
    <div class="wo-info-grid">${workInfoLine('Tên công việc',e(publicNarrative(w.title)))}${workInfoLine('Thiết bị liên quan',c?showLink('cmp',c.id,c.code+' · '+c.name):'Chưa liên kết')}${workInfoLine('Vị trí thực hiện',l?showLink('loc',l.id,l.code+' · '+l.name):'—')}${workInfoLine('Chi phí đã ghi',`<b>${money(costs.reduce((a,z)=>a+z.amount,0))}</b>`)}</div>
  </div><div class="wo-panel"><div class="wo-panel-title">${icon('history')} Giao dịch đã ghi nhận trong WO</div>
    ${events.length?`<div class="wo-simple-log">${events.slice().sort((a,b)=>b.date.localeCompare(a.date)).map(ev=>`<div><time>${datetime(ev.date)}</time>${badge(EVENT_LABEL[ev.type]||ev.type,ev.type==='install'?'green':ev.type==='remove'?'amber':'blue')}<b>${e(unitCode(ev.componentId))}</b><span>${e(publicNarrative(ev.note||''))}</span></div>`).join('')}</div>`:'<p class="muted">Chưa có giao dịch tháo/lắp liên kết công việc.</p>'}
  </div>
 </div><div class="wo-detail-right"><div class="wo-panel"><div class="wo-panel-title">${icon('asset')} Tài sản & liên kết</div>
 ${workInfoLine('Tài sản / Cẩu cấp 1',(l&&craneAtLocation(l.id)?showLink('loc',craneAtLocation(l.id).id,craneAtLocation(l.id).code+' · '+craneAtLocation(l.id).name):'—'))}
 ${workInfoLine('Cụm / vị trí công việc',l?showLink('loc',l.id,l.code+' · '+l.name):'—')}
 ${workInfoLine('Hộp giảm tốc / khung chụp tham chiếu',c?showLink('cmp',c.id,c.code+' · '+c.name):'—')}
 <div class="wo-explainer">Ghi nhận thay thế thực tế tại tab <b>Thực hiện thay thế</b>. Lịch sử của từng hộp giảm tốc và vị trí đặt được cập nhật tự động.</div>
 </div></div></div>`;
}
function workDetailOtherTab(w){
 const events=db.events.filter(ev=>ev.woId===w.code).sort((a,b)=>b.date.localeCompare(a.date));
 if(ui.woTab==='execution')return `<div class="wo-panel"><div class="wo-panel-title">${icon('clipboard')} Nội dung thực hiện</div><div class="wo-description">${e(publicNarrative(w.description||w.title))}</div><div class="note-block">Phát sinh tháo/lắp được ghi tại tab “Thực hiện thay thế” để tự động vào nhật ký của hộp giảm tốc và vị trí.</div></div>`;
 if(ui.woTab==='log')return `<div class="wo-panel"><div class="wo-panel-title">${icon('history')} Nhật ký công việc · ${events.length} giao dịch</div>${events.length?`<div class="wo-simple-log">${events.map(ev=>`<div><time>${datetime(ev.date)}</time>${badge(EVENT_LABEL[ev.type]||ev.type,ev.type==='install'?'green':ev.type==='remove'?'amber':'blue')}<b>${e(unitCode(ev.componentId))}</b><span>${e(publicNarrative(ev.note||''))} · ${e(eventCrane(ev)?.code||'')}</span></div>`).join('')}</div>`:'<p class="muted">Chưa phát sinh nhật ký liên kết WO.</p>'}</div>`;
 const name={staff:'Nhân công',materials:'Vật tư',discussion:'Trao đổi',documents:'Tài liệu'}[ui.woTab]||'Thông tin';
 return `<div class="wo-panel"><div class="wo-panel-title">${icon('clipboard')} ${name}</div><p class="muted">Chưa có dữ liệu ${name.toLowerCase()} trong Work Order mô phỏng này. Không phát sinh dữ liệu quản lý mới.</p></div>`;
}
function workReplacementInfo(w){
 const slots=assemblySlots(),slot=node(ui.woReplacementSlot),old=slot?installedAt(slot.id)[0]:null;
 const available=db.components.filter(c=>slot&&c.status==='warehouse'&&!c.locationId&&isCompatible(c,slot));
 const crane=slot?craneAtLocation(slot.id):null;
 const disabled=['done','cancel'].includes(w.status);
 const woCost=db.costs.filter(c=>c.woId===w.code||c.woId===w.id);
 // Display the technical asset code recorded at the mounting position. Keep
 // the physical component ID (old.id) untouched for lifecycle history/costs.
 const assetLabel=slot?e(slot.code)+' · '+e(slot.name):'—';
 return `<div class="wo-replace-page"><div class="wo-replace-header"><h2>${icon('move',19)} Thực hiện thay thế hộp giảm tốc / khung chụp</h2><p>Ghi nhận công việc thực tế. Vị trí đặt, hộp cũ, hộp mới và cẩu được liên kết với chính WO này.</p></div>
 <div class="wo-panel"><div class="wo-panel-title">${icon('pin')} Vị trí đặt trên cẩu</div>
 <label class="wo-replace-select-label" for="wo-slot">Chọn tài sản HGT / khung chụp cần thay</label>
 <select class="select" id="wo-slot">${slots.map(z=>`<option value="${e(z.id)}" ${z.id===ui.woReplacementSlot?'selected':''}>${e(z.code+' – '+z.name)} (${e(assemblyInstallPosition(z))})</option>`).join('')}</select>
 <div class="wo-asset-cards">
 <div class="wo-asset-tile"><small>Cẩu đang quản lý vị trí</small><b>${crane?e(crane.code)+' · '+e(crane.name):'Chưa xác định cẩu'}</b><span>${slot?e(assemblyInstallPosition(slot)):'—'}</span></div>
 <div class="wo-asset-tile"><small>Vị trí / tài sản lắp đặt</small><b>${slot?e(slot.code)+' · '+e(slot.name):'—'}</b><span>${slot?e(slot.parentId?node(slot.parentId)?.name:'Khung chụp'):'—'}</span></div>
 <div class="wo-asset-tile"><small>Tài sản HGT / khung chụp đang sử dụng</small><b>${old?assetLabel:'Vị trí đang trống'}</b><span>${old?e(old.serial||'Chưa có serial')+' · '+e(old.place):'Không có thiết bị lắp tại vị trí'}</span>${old?statusBadge(old.status):badge('Dự phòng','blue')}</div>
 </div></div>
 <div class="wo-panel"><div class="wo-panel-title">${icon('wrench')} Ghi nhận thiết bị thay thế</div>
 <div class="form-hint">Chi phí đã ghi theo WO: <b>${money(woCost.reduce((sum,c)=>sum+Number(c.amount||0),0))}</b> (${woCost.length} khoản). Xem trong Chi phí bảo trì.</div>
 ${disabled?`<div class="notice warn">WO ở trạng thái ${e(WO_STATUS[w.status][0])}. Cần chuyển WO về trạng thái có thể thực hiện trước khi ghi phát sinh mới.</div>`:''}
 <form id="modal-form" data-form="wo-replacement" class="wo-replacement-form">
  <input type="hidden" name="target" value="${e(slot?.id||'')}"><input type="hidden" name="woId" value="${e(w.code)}">
  <div class="form-grid">
   <div class="form-field"><label>Tài sản hiện tại sẽ tháo</label><div class="replacement-display">${old?assetLabel:'Không có thiết bị (lắp mới)'}</div></div>
   ${selectField('replacementId','Hộp giảm tốc / Khung chụp thay vào <span class="req">*</span>',available.map(c=>({value:c.id,label:c.code+' – '+publicNarrative(c.name)+' · '+c.serial})),available[0]?.id||'','required', '— Chọn thiết bị dự phòng —')}
   ${selectField('place','Nơi chuyển thiết bị cũ',placeOptions,'Kho kỹ thuật')}
   ${field('at','Thời điểm thay thế <span class="req">*</span>',stamp(),'datetime-local','required')}
   <div class="form-field wide">${field('note','Nội dung thực hiện / lý do','','textarea','placeholder="Thay hộp giảm tốc do bảo dưỡng; hộp cũ chuyển xưởng..."')}</div>
  </div>${replacementCostFields(old,available[0],slot)}
  <div class="wo-replace-footer"><span>${available.length?'Giao dịch tháo và lắp được ghi vào nhật ký thiết bị & vị trí, cùng tham chiếu WO.':'Chưa có thiết bị dự phòng tương thích sẵn sàng.'}</span>
  <button class="btn primary" type="submit" ${disabled||!available.length?'disabled':''}>${icon('check')} Xác nhận thay thế & ghi lịch sử</button></div>
 </form></div></div>`;
}
function woDetailScreen(){if(!ui.woOpen)return '';
 const w=db.workorders.find(x=>x.id===ui.woId);if(!w)return '';
 return `<section class="wo-fullscreen" role="dialog" aria-modal="true" aria-label="Chi tiết công việc ${e(w.code)}"><div class="wo-topline"><b>${icon('clipboard')} Chi tiết công việc: ${e(w.code)} – ${e(publicNarrative(w.title))}</b><div>${button('wo-close',icon('close',18)+' Đóng','wo-top-close')}</div></div>
 <div class="wo-detail-hero"><div class="wo-hero-fields">${workInfoLine('Mã công việc',e(w.code))}${workInfoLine('Loại công việc',e(w.type))}${workInfoLine('Trạng thái',woBadge(w.status))}${workInfoLine('Ngày lập',date(w.date))}</div>
 <div class="wo-detail-title"><div><small>TÊN CÔNG VIỆC</small><h1>${e(publicNarrative(w.title))}</h1></div>${button('edit-wo',icon('edit')+' Sửa công việc','btn small',`data-id="${e(w.id)}"`)} </div></div>
 <div class="wo-detail-tabs" role="tablist">${[['info','Thông tin chung','info'],['execution','Nội dung thực hiện','clipboard'],['staff','Nhân công','asset'],['materials','Vật tư','box'],['discussion','Trao đổi','info'],['documents','Tài liệu','suitcase'],['log','Nhật ký','history'],['replacement','Thực hiện thay thế','move']].map(([k,t,i])=>button('wo-tab',icon(i)+ ' '+t,`wo-detail-tab ${ui.woTab===k?'active':''}`,`data-id="${k}" role="tab" aria-selected="${ui.woTab===k}"`)).join('')}</div>
 <div class="wo-detail-scroll">${ui.woTab==='replacement'?workReplacementInfo(w):ui.woTab==='info'?workDetailInfo(w):workDetailOtherTab(w)}</div>
 <div class="wo-detail-bottom"><span>${icon('info',14)} Dữ liệu mô phỏng · ${e(w.code)} · Giao dịch ghi một lần vào nhật ký chung</span>${button('wo-close',icon('check')+' Hoàn tất','btn primary small')}</div>
 </section>`;
}
function render(){let currentView={assets:gridView,workorders:workordersView,reports:reportsView,references:referencesView}[ui.page]||gridView;document.getElementById('app').innerHTML=header()+`<div class="app-layout">${moduleNav()}<div class="module-content">`+heading()+`<main class="grid-main">${currentView()}</main>`+`<footer class="footer">PortAsset CMMS v1.5.1 • Public Safe • Dữ liệu mô phỏng • Lưu cục bộ trên trình duyệt, không đồng bộ.</footer></div></div>`+detailScreen()+woDetailScreen();document.body.classList.toggle('showing-detail',!!ui.detailOpen||!!ui.woOpen)}
function toast(message,bad=false){let r=document.getElementById('toast-root');r.innerHTML=`<div class="toast ${bad?'bad':''}">${e(message)}</div>`;clearTimeout(toast.timer);toast.timer=setTimeout(()=>r.innerHTML='',4000)}
function modal(title,body,footer='',wide=false){document.getElementById('modal-root').innerHTML=`<div class="modal-overlay" data-overlay="1"><section role="dialog" aria-modal="true" aria-label="${e(title)}" class="modal ${wide?'wide':''}"><div class="modal-header"><h2>${e(title)}</h2>${button('close-modal',icon('close'),'btn small icon-only','aria-label="Đóng"')}</div><div class="modal-body">${body}</div><div class="modal-footer">${footer||button('close-modal','Đóng','btn')}</div></section></div>`;setTimeout(()=>document.querySelector('#modal-root input:not([type=hidden]),#modal-root select')?.focus(),10)}
function closeModal(){document.getElementById('modal-root').innerHTML=''}
function options(arr,selected='',blank='— Chọn —'){return `<option value="">${e(blank)}</option>`+arr.map(x=>`<option value="${e(x.value)}" ${x.value===selected?'selected':''}>${e(x.label)}</option>`).join('')}
function field(name,label,value='',type='text',extra='',hint=''){return `<div class="form-field"><label for="f-${name}">${label}</label>${type==='textarea'?`<textarea class="textarea" id="f-${name}" name="${name}" ${extra}>${e(value)}</textarea>`:`<input class="input" id="f-${name}" name="${name}" type="${type}" value="${e(value)}" ${extra}>`}${hint?`<div class="form-hint">${e(hint)}</div>`:''}</div>`}
function selectField(name,label,arr,selected='',extra='',blank='— Chọn —'){return `<div class="form-field"><label for="f-${name}">${label}</label><select class="select" name="${name}" id="f-${name}" ${extra}>${options(arr,selected,blank)}</select></div>`}
function submitButtons(label='Lưu'){return `${button('close-modal','Hủy','btn')}<button type="submit" form="modal-form" class="btn primary">${icon('check')} ${e(label)}</button>`}
function openNode(editId='',defaultParent=''){let l=editId?node(editId):null;let parents=db.locations.filter(x=>!editId||x.id!==editId&&!isDescendant(x.id,editId)).map(x=>({value:x.id,label:'Cấp '+level(x.id)+' · '+x.code+' · '+x.name}));modal(l?'Chỉnh sửa vị trí / cụm kỹ thuật':'Thêm vị trí / cụm kỹ thuật',`<form id="modal-form" data-form="node"><input type="hidden" name="editing" value="${e(editId||'')}"><div class="notice">Cây tài sản gồm cẩu, cụm và HGT / Khung chụp. Các thiết bị tháo/lắp được theo dõi theo số serial hoặc mã riêng để bảo toàn lịch sử sửa chữa, chi phí khi thay thế.</div><div class="form-grid">${field('code','Mã kỹ thuật <span class="req">*</span>',l?.code||'','text','required maxlength="45"')}${field('name','Tên vị trí / cụm <span class="req">*</span>',l?.name||'','text','required maxlength="120"')}${selectField('parentId','Tài sản cha',parents,l?.id==='crane'?'':l?.parentId||defaultParent||'crane','','— Không có / Cấp 1 —')}${selectField('kind','Phân loại vị trí',[{value:'normal',label:'Thông thường'},{value:'gearbox-slot',label:'Vị trí đặt hộp giảm tốc'},{value:'spreader-slot',label:'Vị trí đặt khung chụp'}],l?.kind||'normal','','— Chọn —')}<div class="form-field wide">${field('notes','Ghi chú',l?.notes||'','textarea')}</div></div></form>`,submitButtons(),false)}
function isDescendant(id,ancestorId){return path(id).some(x=>x.id===ancestorId)}
function openComponent(editId){let c=editId?comp(editId):null;modal(c?'Chỉnh sửa hồ sơ thiết bị vật lý':'Khai báo thiết bị vật lý mới',`<form id="modal-form" data-form="component"><input type="hidden" name="editing" value="${e(editId||'')}"><div class="notice green">Mỗi hộp giảm tốc / khung chụp cần mã riêng, dù đang lắp cẩu, trong kho hay gửi sửa chữa. Mã này dùng xuyên suốt vòng đời.</div><div class="form-grid">${field('code','Mã thiết bị <span class="req">*</span>',c?.code||'','text','required maxlength="45"')}${field('name','Tên thiết bị <span class="req">*</span>',c?.name||'','text','required maxlength="120"')}${selectField('kind','Loại thiết bị',[{value:'gearbox',label:'Hộp giảm tốc'},{value:'spreader',label:'Khung chụp (Spreader)'}],c?.kind||'gearbox','','— Chọn —')}${field('serial','Số serial',c?.serial||'','text','maxlength="80"')}${field('model','Model',c?.model||'','text','maxlength="80"')}${field('maker','Hãng sản xuất',c?.maker||'','text','maxlength="100"')}${field('year','Năm sản xuất',c?.year||'','number','min="1900" max="2100"')}${field('condition','Tình trạng kỹ thuật',c?.condition||'Sẵn sàng')}${field('notes','Ghi chú',c?.notes||'','textarea')}<div class="form-field wide"><div class="form-hint">${c?'Vị trí đặt và trạng thái không sửa trực tiếp tại đây. Hãy dùng nghiệp vụ tháo/lắp để bảo toàn lịch sử.':'Thiết bị mới vào kho kỹ thuật. Sau khi lưu, dùng “Ghi nhận tháo/lắp” để lắp lên cẩu.'}</div></div></div></form>`,submitButtons())}
const placeOptions=[{value:'Kho kỹ thuật',label:'Kho kỹ thuật'},{value:'Xưởng nội bộ',label:'Xưởng nội bộ'},{value:'Đơn vị sửa chữa trong nước',label:'Đơn vị sửa chữa trong nước'},{value:'Đơn vị sửa chữa nước ngoài',label:'Đơn vị sửa chữa nước ngoài'}];
function openMovement(id='',slot=''){let c=comp(id)||installedAt(slot)[0]||db.components.find(x=>x.kind===node(slot)?.kind?.replace('-slot','')&&x.status==='warehouse')||db.components.find(x=>x.kind===node(slot)?.kind?.replace('-slot',''))||db.components[0];let operation=c.status==='installed'?'remove':c.status==='repair'?'complete':'install';modal('Ghi nhận tháo / lắp / luân chuyển',`<form id="modal-form" data-form="movement"><div class="form-grid">${selectField('componentId','Tài sản HGT / khung chụp <span class="req">*</span>',db.components.filter(x=>x.status!=='retired').map(x=>({value:x.id,label:x.code+' · '+x.name})),c.id,'required')}${selectField('operation','Nghiệp vụ <span class="req">*</span>',[{value:'install',label:'Lắp vào vị trí trên cẩu'},{value:'remove',label:'Tháo khỏi cẩu'},{value:'send',label:'Chuyển đi xưởng / nhà cung cấp'},{value:'complete',label:'Nghiệm thu sửa chữa / Nhập kho'}],operation,'required')}${selectField('target','Vị trí đặt vào',[...db.locations].filter(x=>x.kind==='gearbox-slot'||x.kind==='spreader-slot').map(x=>({value:x.id,label:x.code+' · '+x.name})),slot||'', '', '— Chọn vị trí —')}${selectField('place','Địa điểm sau giao dịch',placeOptions,'Kho kỹ thuật')}${field('at','Thời gian ghi nhận <span class="req">*</span>',stamp(),'datetime-local','required')}${field('woId','Số WO tham chiếu (tùy chọn)','','text','list="wo-suggestions"')}<div class="form-field wide">${field('note','Nội dung / lý do', '','textarea','placeholder="Ví dụ: Tháo SIM01.02.1 gửi xưởng, lắp thiết bị dự phòng SIM-DP.HGT.006..."')}</div></div><datalist id="wo-suggestions">${db.workorders.map(x=>`<option value="${e(x.code)}"></option>`).join('')}</datalist><div class="notice" id="movement-hint">Thiết bị không được lắp đồng thời vào hai vị trí. Nếu vị trí đã có thiết bị khác, cần ghi nhận tháo thiết bị đó trước.</div></form>`,submitButtons('Xác nhận giao dịch'));
 setTimeout(updateMoveHint,0)}
function updateMoveHint(){let form=document.getElementById('modal-form');if(!form||form.dataset.form!=='movement')return;let c=comp(form.componentId.value),op=form.operation.value,slot=node(form.target.value);let needsPlace=op==='remove'||op==='send',needsSlot=op==='install';form.target.closest('.form-field').classList.toggle('hide',!needsSlot);form.place.closest('.form-field').classList.toggle('hide',!needsPlace);let msg=op==='install'?(c?.locationId?'Thiết bị đang lắp. Phải tháo trước khi lắp sang vị trí khác.':slot&&installedAt(slot.id).length?'Vị trí đã có thiết bị. Phải tháo thiết bị đang lắp trước.':slot&&!isCompatible(c,slot)?'Loại thiết bị không tương thích với vị trí này.':'Chọn vị trí tương thích và đang trống.') :op==='remove'?(c?.locationId?'Tháo thiết bị khỏi vị trí hiện tại rồi cập nhật địa điểm sau khi tháo.':'Thiết bị này hiện không lắp trên cẩu.') :op==='send'?(c?.locationId?'Cần tháo khỏi cẩu trước khi chuyển đi sửa chữa.':'Ghi nhận nơi sửa chữa; giữ nguyên mã và lịch sử thiết bị.') : 'Nghiệm thu hoàn tất sửa chữa và chuyển thiết bị về kho kỹ thuật.';document.getElementById('movement-hint').textContent=msg;}
function openWO(id='',slot='',editing=false){let w=editing?db.workorders.find(x=>x.id===id):null;let c=comp(id)||comp(w?.componentId);modal(w?'Cập nhật Work Order':'Tạo Work Order bảo trì',`<form id="modal-form" data-form="wo"><input type="hidden" name="editing" value="${e(w?.id||'')}"><div class="form-grid">${field('code','Số Work Order <span class="req">*</span>',w?.code||`WO-DEMO-${today().slice(0,4)}-${String(db.workorders.length+1).padStart(4,'0')}`,'text','required maxlength="45"')}${field('date','Ngày lập',w?.date||today(),'date','required')}${field('title','Nội dung công việc <span class="req">*</span>',publicNarrative(w?.title||''),'text','required maxlength="180"')}${selectField('type','Loại công việc',[{value:'Sửa chữa',label:'Sửa chữa'},{value:'Bảo dưỡng',label:'Bảo dưỡng'},{value:'Kiểm tra',label:'Kiểm tra'},{value:'Đại tu',label:'Đại tu'}],w?.type||'Sửa chữa','required')}${selectField('componentId','Tài sản liên quan',db.components.map(x=>({value:x.id,label:x.code+' · '+x.name})),w?.componentId||c?.id||'')}${selectField('locationId','Vị trí kỹ thuật liên quan',db.locations.map(x=>({value:x.id,label:x.code+' · '+x.name})),w?.locationId||slot||c?.locationId||'')}${selectField('status','Trạng thái WO',Object.entries(WO_STATUS).map(([value,v])=>({value,label:v[0]})),w?.status||'open','required')}<div class="form-field wide">${field('description','Mô tả / kết quả công việc',publicNarrative(w?.description||''),'textarea')}</div></div>
<div class="wo-movement-box"><div class="wo-movement-head">${icon('move',19)} <b>Ghi nhận tháo/lắp phát sinh cùng WO</b> <span>Không thay đổi loại công việc</span></div>
<div class="form-grid">${selectField('movementOperation','Giao dịch thực tế',[
{value:'install',label:'Lắp lên cẩu'},{value:'remove',label:'Tháo khỏi cẩu'},{value:'send',label:'Gửi đơn vị sửa chữa'},{value:'complete',label:'Nghiệm thu / Nhập kho'}], '', '', '— Không phát sinh thao tác tháo/lắp —')}</div>
<div id="wo-movement-fields" class="hide"><div class="form-grid">${field('movementAt','Thời điểm tháo/lắp thực tế',stamp(),'datetime-local')}${selectField('movementTarget','Vị trí đặt vào',db.locations.filter(l=>['gearbox-slot','spreader-slot'].includes(l.kind)).map(l=>({value:l.id,label:l.code+' · '+l.name})),w?.locationId||slot||c?.locationId||'','','— Chọn vị trí —')}${selectField('movementPlace','Địa điểm sau giao dịch',placeOptions,'Kho kỹ thuật')}${field('movementNote','Diễn giải tháo/lắp','','textarea')}</div><div class="notice" id="wo-movement-hint">Phải chọn tài sản cần ghi nhận. Khi lưu WO, hệ thống đồng thời cập nhật vị trí và tạo đúng một nhật ký có mã WO tham chiếu.</div></div></div>
<div class="form-hint">Nếu chỉ lập kế hoạch công việc, hãy để “Không phát sinh”. Chỉ chọn giao dịch khi tháo/lắp/chuyển xưởng đã thực sự diễn ra. Chi phí được ghi riêng một lần trong sổ chi phí.</div></form>`,submitButtons());setTimeout(updateWOHint,0)}
function updateWOHint(){
 let form=document.getElementById('modal-form');if(!form||form.dataset.form!=='wo')return;
 const operation=form.querySelector('[name="movementOperation"]')?.value||'',section=document.getElementById('wo-movement-fields');
 if(!section)return;section.classList.toggle('hide',!operation);
 const position=form.querySelector('[name="movementTarget"]')?.closest('.form-field');
 const destination=form.querySelector('[name="movementPlace"]')?.closest('.form-field');
 if(position)position.classList.toggle('hide',operation!=='install');
 if(destination)destination.classList.toggle('hide',!['remove','send'].includes(operation));
 const hint=document.getElementById('wo-movement-hint');
 if(hint&&operation)hint.textContent='Giao dịch được xác nhận cùng WO, ghi vào lịch sử một lần và cập nhật trạng thái thiết bị. Không làm thay đổi loại WO.';
}
function openCost(id=''){let c=comp(id)||db.components[0];modal('Ghi nhận chi phí sửa chữa / bảo dưỡng',`<form id="modal-form" data-form="cost"><div class="form-grid">${selectField('componentId','Thiết bị chịu chi phí <span class="req">*</span>',db.components.map(c=>({value:c.id,label:c.code+' · '+c.name})),c.id,'required')}${field('date','Ngày phát sinh <span class="req">*</span>',today(),'date','required')}${selectField('category','Loại chi phí',[{value:'Sửa chữa',label:'Sửa chữa'},{value:'Bảo dưỡng',label:'Bảo dưỡng'},{value:'Kiểm tra',label:'Kiểm tra'},{value:'Vận chuyển',label:'Vận chuyển'},{value:'Khác',label:'Khác'}],'Sửa chữa','required')}${field('amount','Số tiền (VND) <span class="req">*</span>','','number','min="0" step="1" required')}${selectField('woId','Tham chiếu Work Order',db.workorders.map(w=>({value:w.id,label:w.code+' · '+publicNarrative(w.title)})),'')}${selectField('locationId','Vị trí / cẩu hưởng chi phí',db.locations.map(x=>({value:x.id,label:x.code+' · '+x.name})),c.locationId||db.events.filter(x=>x.componentId===c.id&&(x.toLoc||x.fromLoc)).sort((a,b)=>b.date.localeCompare(a.date))[0]?.toLoc||db.events.filter(x=>x.componentId===c.id&&(x.toLoc||x.fromLoc)).sort((a,b)=>b.date.localeCompare(a.date))[0]?.fromLoc||'', '', '— Chưa phân bổ —')}<div class="form-field wide">${field('note','Diễn giải','','textarea','required')}</div></div><div class="notice green">Mỗi khoản chi được tạo <b>một bút toán</b> và liên kết với mã thiết bị. Báo cáo theo cẩu hoặc WO phải lấy cùng bút toán đó để tránh tính trùng.</div></form>`,submitButtons('Ghi chi phí'))}
function dataModal(){modal('Quản lý dữ liệu demo',`<div class="notice">BẢN PUBLIC: Không nhập hay import hồ sơ cẩu thật, thông tin nội bộ, serial hoặc chi phí thực tế. Website tĩnh trên GitHub Pages không có cơ sở dữ liệu chung. Mọi người thấy cùng bộ dữ liệu mẫu ban đầu; các thay đổi chỉ lưu trên trình duyệt của người thao tác. Có thể xuất / nhập JSON để trao đổi bản chỉnh sửa.</div><div class="btn-group" style="margin-bottom:15px">${button('export',icon('download')+' Xuất JSON','btn primary')}${button('import',icon('upload')+' Nhập JSON','btn')}${button('reset',icon('reset')+' Khôi phục dữ liệu mẫu','btn danger')}${button('share',icon('link')+' Sao chép link màn hình','btn')}</div><div class="separator"></div><h3>Phạm vi dữ liệu đang có</h3><p>${db.locations.length} vị trí • ${db.components.length} thiết bị vật lý • ${db.events.length} giao dịch luân chuyển • ${db.workorders.length} WO • ${db.costs.length} khoản chi</p><input type="file" id="import-file" accept="application/json,.json" class="hide"><p class="small-note">Dữ liệu đầu vào được xác thực các trường và quan hệ chính trước khi nhập. Chức năng này chỉ phục vụ mockup, chưa thay thế phân quyền / audit log trên hệ thống thật.</p>`,button('close-modal','Đóng','btn'))}
function fail(msg){toast(msg,true);return false}
// One validation/commit path for standalone movements and movements recorded with a Work Order.
// Prepare validates without mutating; commit executes exactly once after WO is safely validated.
function prepareMovement(componentId,operation,targetId,place,at,note,woId=''){
 const c=comp(componentId),target=node(targetId);
 if(!c||!at)return {error:'Cần chọn thiết bị và thời gian giao dịch.'};
 if(c.status==='retired')return {error:'Thiết bị đã ngừng sử dụng.'};
 if(!['install','remove','send','complete'].includes(operation))return {error:'Nghiệp vụ không hợp lệ.'};
 const last=db.events.filter(v=>v.componentId===c.id).sort((a,b)=>b.date.localeCompare(a.date))[0];
 if(last&&at<last.date)return {error:`Không thể ghi nhận trước nhật ký mới nhất (${datetime(last.date)}).`};
 const event={id:ident('EV'),componentId:c.id,type:operation,date:at,note,place:'',fromLoc:null,toLoc:null,woId};
 const change={};
 if(operation==='install'){
  if(c.locationId||c.status==='installed')return {error:`${c.code} đang lắp trên cẩu. Cần tháo trước.`};
  if(c.status==='repair')return {error:'Thiết bị đang sửa chữa. Phải nghiệm thu / nhập kho trước khi lắp.'};
  if(!target)return {error:'Cần chọn vị trí đặt.'};
  if(!isCompatible(c,target))return {error:'Loại thiết bị không tương thích với vị trí đặt.'};
  if(installedAt(target.id).length)return {error:`Vị trí ${target.code} đã có ${installedAt(target.id).map(x=>x.code).join(', ')}. Hãy tháo thiết bị cũ trước.`};
  Object.assign(change,{locationId:target.id,place:(craneAtLocation(target.id)?.name||'Cẩu')+' / '+target.code,status:'installed',condition:'Đạt'});event.toLoc=target.id;
 }else if(operation==='remove'){
  if(!c.locationId)return {error:'Thiết bị chưa lắp trên cẩu, không thể tháo.'};
  if(!place)return {error:'Cần chọn địa điểm sau khi tháo.'};
  event.fromLoc=c.locationId;event.place=place;
  Object.assign(change,{locationId:null,place,status:place==='Kho kỹ thuật'?'warehouse':'repair',condition:place==='Kho kỹ thuật'?'Chờ kiểm tra':'Đang sửa chữa'});
 }else if(operation==='send'){
  if(c.locationId)return {error:'Cần tháo thiết bị trước khi chuyển đi sửa chữa.'};
  if(!place||place==='Kho kỹ thuật')return {error:'Cần chọn xưởng / đơn vị sửa chữa.'};
  Object.assign(change,{status:'repair',place,condition:'Đang sửa chữa'});event.place=place;
 }else{
  if(c.locationId||c.status!=='repair')return {error:'Chỉ nghiệm thu được thiết bị đang ở đơn vị sửa chữa và đã tháo khỏi cẩu.'};
  Object.assign(change,{status:'warehouse',place:'Kho kỹ thuật',condition:'Sẵn sàng'});event.place='Kho kỹ thuật';
 }
 // Historical attribution is stored when an event is created so subsequent transfers do not rewrite its crane.
 const context=eventCrane(event);
 if(context)Object.assign(event,{craneId:context.id,craneCode:context.code,craneName:context.name});
 return {event,change,component:c};
}
function commitMovement(prepared){Object.assign(prepared.component,prepared.change);db.events.push(prepared.event)}
function processForm(form){const fd=new FormData(form),g=k=>trim(fd.get(k)),editing=g('editing');
 if(form.dataset.form==='meter-def'){
  const ownerType=g('ownerType'),ownerId=g('ownerId'),kind=g('kind');
  if(!['loc','cmp'].includes(ownerType)||!(ownerType==='loc'?node(ownerId):comp(ownerId))||!METER_KINDS[kind])return fail('Thông số vận hành không hợp lệ.');
  if(db.meterDefs.some(d=>d.ownerType===ownerType&&d.ownerId===ownerId&&d.kind===kind))return fail('Thông số này đã tồn tại trên tài sản.');
  const id=ident('MDEF');db.meterDefs.push({id,ownerType,ownerId,kind});ui.meterDefId=id;save();closeModal();ui.detail='meters';render();toast('Đã khai báo chỉ số vận hành.');return true;
 }
 if(form.dataset.form==='meter-reading'){
  const err=recordMeterReading(g);if(err)return fail(err);
  ui.meterDefId=g('defId');save();closeModal();ui.detail='meters';render();toast('Đã ghi chỉ số tích lũy, giữ nguyên khi luân chuyển tài sản.');return true;
 }
 if(form.dataset.form==='node'){
  const code=g('code'),name=g('name'),parentId=g('parentId'),kind=g('kind')||'normal';if(!code||!name)return fail('Mã kỹ thuật và tên vị trí là bắt buộc.');if(db.locations.some(x=>x.code.toLowerCase()===code.toLowerCase()&&x.id!==editing))return fail('Mã kỹ thuật đã tồn tại.');
  if(editing){let x=node(editing);if(!x)return fail('Không tìm thấy vị trí.');if(level(x.id)===1&&parentId)return fail('Cẩu gốc không thể chuyển thành tài sản con.');if(parentId&&isDescendant(parentId,editing))return fail('Không thể chuyển vị trí vào chính nhánh con của nó.');if(x.kind!==kind&&installedAt(editing).length)return fail('Cần tháo thiết bị đang lắp trước khi đổi loại vị trí.');if(parentId!==x.parentId&&db.events.some(v=>v.toLoc===editing||v.fromLoc===editing))return fail('Vị trí có lịch sử tháo/lắp. Demo không cho đổi cha để tránh làm sai ngữ cảnh lịch sử.');Object.assign(x,{code,name,parentId:parentId||null,kind:level(x.id)===1?'crane':kind,notes:g('notes')});
  }else{if(!parentId)return fail('Vui lòng chọn tài sản cha cho vị trí mới.');{let newId=ident('LOC');db.locations.push(n(newId,code,name,parentId,{kind,notes:g('notes')}));ui.selected='loc:'+newId;ui.detailOpen=true;ui.detail='info';ui.expanded.add(parentId)}}
  save();closeModal();toast('Đã lưu vị trí kỹ thuật.');render();return true;
 }
 if(form.dataset.form==='component'){
  let code=g('code'),name=g('name'),kind=g('kind'),serial=g('serial');if(!code||!name)return fail('Mã và tên thiết bị không được để trống.');if(!['gearbox','spreader'].includes(kind))return fail('Loại thiết bị không hợp lệ.');if(db.components.some(x=>x.code.toLowerCase()===code.toLowerCase()&&x.id!==editing))return fail('Mã thiết bị vật lý bị trùng.');if(serial&&db.components.some(x=>x.serial&&x.serial.toLowerCase()===serial.toLowerCase()&&x.id!==editing))return fail('Serial đã được khai báo cho thiết bị khác.');
  const attrs={code,name,kind,serial,model:g('model'),maker:g('maker'),year:g('year'),condition:g('condition'),notes:g('notes')};
  if(editing){let c=comp(editing);if(!c)return fail('Thiết bị không còn tồn tại.');if(c.code!==code)return fail('Không được đổi mã thiết bị đã khai báo. Mã là định danh xuyên suốt lịch sử.');if(c.kind!==kind&&c.locationId)return fail('Không được đổi loại thiết bị khi đang lắp.');Object.assign(c,attrs);}
  else{let id=code;db.components.push({id,...attrs,locationId:null,place:'Kho kỹ thuật',status:'warehouse'});}
  ensureMeters(db);save();closeModal();ui.page='assets';ui.selected='cmp:'+(editing||code);ui.detailOpen=true;ui.detail='info';toast('Đã lưu hồ sơ thiết bị.');render();return true;
 }
  if(form.dataset.form==='wo-replacement'){
   const w=db.workorders.find(x=>x.id===ui.woId);
   if(!w||!ui.woOpen)return fail('Không tìm thấy công việc đang mở.');
   if(['done','cancel'].includes(w.status))return fail('WO đã hoàn thành hoặc hủy. Không thể thêm giao dịch mới.');
   if(g('woId')!==w.code)return fail('WO tham chiếu không khớp công việc đang mở.');
   const error=recordReplacement(g,true);if(error)return fail(error);
   save();ui.woTab='replacement';toast(g('costAmount')?'Đã thay thế, cập nhật lịch sử và ghi 1 khoản chi phí vào WO.':'Đã thay thế và cập nhật lịch sử; không phát sinh chi phí.');render();return true;
  }
  if(form.dataset.form==='replacement'){
   const error=recordReplacement(g);if(error)return fail(error);
   save();closeModal();ui.page='assets';ui.selected='loc:crane';ui.detail='assembly';ui.detailOpen=true;
   toast(g('costAmount')?'Đã thay thế, cập nhật lịch sử và ghi 1 khoản chi phí.':'Đã thay thế và cập nhật lịch sử; không phát sinh chi phí.');render();return true;
  }
 if(form.dataset.form==='movement'){
  const componentId=g('componentId'),op=g('operation'),woId=g('woId');
  const linkedWO=woId?db.workorders.find(w=>w.code===woId):null;
  if(woId&&!linkedWO)return fail('Số WO tham chiếu không tồn tại.');
  if(linkedWO?.componentId&&linkedWO.componentId!==componentId)return fail('WO đã liên kết với một thiết bị khác.');
  const tx=prepareMovement(componentId,op,g('target'),g('place'),g('at'),g('note'),woId);
  if(tx.error)return fail(tx.error);
  commitMovement(tx);save();closeModal();ui.page='assets';ui.selected='cmp:'+componentId;
  ui.detail='equipment';ui.detailOpen=true;toast(`Đã ghi ${EVENT_LABEL[op].toLowerCase()} cho ${tx.component.code}. Nhật ký được cập nhật tự động.`);render();return true;
 }
 if(form.dataset.form==='wo'){
  let code=g('code'),title=g('title'),dateValue=g('date'),status=g('status'),componentId=g('componentId'),locationId=g('locationId');
  if(!code||!title||!dateValue)return fail('Thiếu mã, ngày hoặc nội dung WO.');
  if(db.workorders.some(x=>x.code.toLowerCase()===code.toLowerCase()&&x.id!==editing))return fail('Số Work Order bị trùng.');
  if(!componentId&&!locationId)return fail('WO cần liên kết với thiết bị vật lý hoặc vị trí kỹ thuật.');
  if(componentId&&!comp(componentId)||locationId&&!node(locationId))return fail('Liên kết WO không hợp lệ.');
  if(!WO_STATUS[status])return fail('Trạng thái WO không hợp lệ.');
  if(editing&&!db.workorders.some(w=>w.id===editing))return fail('Không tìm thấy WO.');
  if(editing&&code!==editing&&db.events.some(ev=>ev.woId===editing||ev.woId===db.workorders.find(w=>w.id===editing)?.code))return fail('Không được đổi mã WO đang có lịch sử tháo/lắp.');
  const operation=g('movementOperation');let tx=null;
  if(operation){
   if(!componentId)return fail('Chọn thiết bị vật lý trước khi ghi nhận giao dịch trong WO.');
   if(!locationId){if(operation==='install')locationId=g('movementTarget');else if(operation==='remove')locationId=comp(componentId)?.locationId||'';}
   tx=prepareMovement(componentId,operation,g('movementTarget'),g('movementPlace'),g('movementAt'),g('movementNote'),code);
   if(tx.error)return fail(tx.error); // Atomic: WO and movement are committed only after both are valid.
  }
  let data={code,title,date:dateValue,status,type:g('type'),componentId,locationId,description:g('description')};
  if(editing){Object.assign(db.workorders.find(x=>x.id===editing),data)}else db.workorders.push({id:code,...data});
  if(tx)commitMovement(tx);
  save();closeModal();if(ui.woOpen){ui.woId=editing||code;ui.woTab='info'}else{ui.page='workorders';ui.detailOpen=false}
  toast(tx?'Đã lưu Work Order và tự động ghi nhận 1 giao dịch tháo/lắp.':'Đã lưu Work Order (chưa phát sinh tháo/lắp).');render();return true;
 }
 if(form.dataset.form==='cost'){
  let componentId=g('componentId'),amount=Number(g('amount')),dateValue=g('date'),woId=g('woId'),locationId=g('locationId');if(!comp(componentId))return fail('Cần chọn thiết bị hợp lệ.');if(!Number.isFinite(amount)||amount<0||!Number.isSafeInteger(amount)||!g('amount'))return fail('Số tiền phải là số nguyên không âm.');if(!dateValue)return fail('Cần có ngày phát sinh chi phí.');if(woId&&!db.workorders.some(w=>w.id===woId))return fail('Work Order không tồn tại.');if(woId&&db.workorders.find(w=>w.id===woId).componentId&&db.workorders.find(w=>w.id===woId).componentId!==componentId)return fail('Work Order đang gắn với thiết bị khác. Chọn đúng WO để tránh sai chi phí.');
  if(locationId&&!node(locationId))return fail('Vị trí hưởng phí không tồn tại.');db.costs.push({id:ident('C'),date:dateValue,componentId,woId,locationId,category:g('category'),amount,note:g('note')});save();closeModal();ui.page='assets';ui.detail='cost';ui.detailOpen=true;toast('Đã ghi nhận một khoản chi phí.');render();return true;
 }
}
function validateMeterData(x){
 if(x.meterDefs!==undefined&&!Array.isArray(x.meterDefs)||x.meterEntries!==undefined&&!Array.isArray(x.meterEntries))throw Error('Danh sách thông số vận hành không hợp lệ.');
 const defs=x.meterDefs||[],rs=x.meterEntries||[],ids=new Set(),unique=new Set(),readingIDs=new Set();
 for(const d of defs){if(!d||typeof d.id!=='string'||ids.has(d.id)||!METER_KINDS[d.kind]||!['loc','cmp'].includes(d.ownerType)||!(d.ownerType==='loc'?x.locations:x.components).some(v=>v.id===d.ownerId))throw Error('Chỉ số vận hành có liên kết sai hoặc trùng ID.');ids.add(d.id);let k=d.ownerType+'|'+d.ownerId+'|'+d.kind;if(unique.has(k))throw Error('Trùng thông số cùng tài sản.');unique.add(k)}
 for(const r of rs){const d=defs.find(x=>x.id===r?.defId);if(!r||typeof r.id!=='string'||readingIDs.has(r.id)||!d||d.ownerType!==r.ownerType||d.ownerId!==r.ownerId||!Number.isFinite(r.total)||!Number.isFinite(r.delta)||!Number.isFinite(r.previous)||r.delta<0||r.total<r.previous||!r.at||isNaN(Date.parse(r.at))||r.locationId&&!x.locations.some(l=>l.id===r.locationId))throw Error('Lịch sử ghi chỉ số không hợp lệ.');readingIDs.add(r.id)}
 for(const d of defs){let prior=-1,lastTime='';for(const r of rs.filter(r=>r.defId===d.id).sort((a,b)=>a.at.localeCompare(b.at))){if(r.at<=lastTime||r.previous!==Math.max(0,prior)||Math.abs(r.previous+r.delta-r.total)>0.001)throw Error('Số lũy kế không nhất quán.');prior=r.total;lastTime=r.at}}
}
function validateImport(x){if(!x||x.schema!==1||!['locations','components','events','workorders','costs'].every(k=>Array.isArray(x[k])))throw Error('Không đúng cấu trúc dữ liệu demo v1.');if(JSON.stringify(x).length>3500000)throw Error('Dữ liệu quá lớn.');for(let [name,items] of Object.entries({locations:x.locations,components:x.components,events:x.events,workorders:x.workorders,costs:x.costs})){const ids=new Set();for(let a of items){if(!a||typeof a.id!=='string'||!a.id||ids.has(a.id))throw Error('ID bị trùng / thiếu trong '+name);ids.add(a.id)}}let ls=new Set(x.locations.map(l=>l.id)),cs=new Set(x.components.map(c=>c.id)),ws=new Set(x.workorders.map(w=>w.id));if(!ls.has('crane'))throw Error('Thiếu tài sản gốc crane.');for(const l of x.locations){if(l.parentId&&!ls.has(l.parentId))throw Error('Tài sản cha không tồn tại: '+l.code);let seen=new Set(),k=l;while(k){if(seen.has(k.id))throw Error('Cây tài sản chứa vòng lặp.');seen.add(k.id);k=x.locations.find(q=>q.id===k.parentId)}}
 let slots=new Set();for(const c of x.components){if(!['gearbox','spreader'].includes(c.kind)||!(STATUS[c.status]||LEGACY_STATUS[c.status]))throw Error('Thiết bị có loại / trạng thái sai.');if(c.locationId){let l=x.locations.find(z=>z.id===c.locationId);if(!l||!isCompatible(c,l)||slots.has(c.locationId)||c.status!=='installed')throw Error('Thiết bị lắp trùng hoặc sai vị trí.');slots.add(c.locationId)}else if(c.status==='installed')throw Error('Thiết bị đang lắp nhưng thiếu vị trí.')}
 for(const v of x.events)if(!cs.has(v.componentId)||(v.fromLoc&&!ls.has(v.fromLoc))||(v.toLoc&&!ls.has(v.toLoc)))throw Error('Lịch sử chứa mã thiết bị/vị trí không hợp lệ.');for(const w of x.workorders)if(w.componentId&&!cs.has(w.componentId)||w.locationId&&!ls.has(w.locationId))throw Error('WO tham chiếu sai.');for(const c of x.costs)if(!cs.has(c.componentId)||c.woId&&!ws.has(c.woId)||c.locationId&&!ls.has(c.locationId)||!Number.isSafeInteger(Number(c.amount))||Number(c.amount)<0)throw Error('Chi phí không hợp lệ.');validateMeterData(x);return true;}
function exportJSON(){let txt=JSON.stringify(db,null,2),blob=new Blob([txt],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='portasset-cmms-data-'+today()+'.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);toast('Đã xuất dữ liệu JSON.')}
async function importJSON(file){if(!file)return;if(file.size>3500000)return fail('File JSON quá lớn.');try{let x=JSON.parse(await file.text());validateImport(x);db=x;migratePublicAssetCodes(db);ensureMeters(db);ensureFiveCraneDemo(db);ensureOtherSpreaderMeters(db);captureMissingCraneSnapshots();save();closeModal();ui.page='assets';ui.selected='loc:crane';ui.detail='info';ui.detailOpen=false;ui.checked.clear();render();toast('Đã nhập dữ liệu JSON hợp lệ.')}catch(ex){fail('Không thể nhập dữ liệu: '+ex.message)}}
function shareLink(){let url=location.href.split('#')[0]+(ui.detailOpen?'#detail/'+encodeURIComponent(ui.selected)+'/'+encodeURIComponent(ui.detail):'#'+ui.page);if(navigator.clipboard?.writeText){navigator.clipboard.writeText(url).then(()=>toast('Đã sao chép liên kết.')).catch(()=>fallbackCopy(url))}else fallbackCopy(url)}
function fallbackCopy(text){let x=document.createElement('textarea');x.value=text;x.style.position='fixed';x.style.top='-1000px';document.body.appendChild(x);x.select();let ok=document.execCommand('copy');x.remove();toast(ok?'Đã sao chép liên kết.':'Không thể sao chép tự động; URL: '+text,!ok)}
function readHash(){let h=location.hash.slice(1);if(!h)return;try{let bits=h.split('/').map(decodeURIComponent);if(bits[0]==='detail'&&bits[1]){let [t,...rest]=bits[1].split(':'),id=rest.join(':');if((t==='loc'&&node(id))||(t==='cmp'&&comp(id))){ui.selected=bits[1];ui.page='assets';ui.detailOpen=true;ui.detail=['info','meters','equipment','work','history','cost','profile','assembly'].includes(bits[2])?bits[2]:'info';return}}if(['assets','workorders','reports','references'].includes(bits[0]))ui.page=bits[0]}catch{}}
document.addEventListener('click',ev=>{
 let t=ev.target.closest('[data-action]');if(!t){if(ev.target.classList?.contains('modal-overlay'))closeModal();return}
 let a=t.dataset.action,id=t.dataset.id||'',slot=t.dataset.slot||'';
 if(a==='open-wo-detail'){openWODetail(id);return}
 if(a==='wo-close'){ui.woOpen=false;render();return}
 if(a==='wo-tab'){if(['info','execution','staff','materials','discussion','documents','log','replacement'].includes(id)){ui.woTab=id;render()}return}
 if(a==='page'){ui.page=['assets','workorders','reports','references'].includes(id)?id:'assets';ui.detailOpen=false;ui.woOpen=false;render();return}
 if(a==='detail-close'||a==='detail-back'){ui.detailOpen=false;ui.detail='info';render();return}
 if(a==='select-loc'){ui.woOpen=false;selectNode('loc',id);return}if(a==='select-cmp'){ui.woOpen=false;selectNode('cmp',id);return}
 if(a==='expand'){ui.expanded.has(id)?ui.expanded.delete(id):ui.expanded.add(id);render();return}
 if(a==='expand-all'){db.locations.forEach(l=>ui.expanded.add(l.id));ui.gridPage=1;render();return}
 if(a==='collapse-all'){ui.expanded.clear();ui.gridPage=1;render();return}
 if(a==='meter-new-def'){openMeterDefinition();return}
 if(a==='meter-new-reading'){openMeterReading(id);return}
 if(a==='meter-select'){ui.meterDefId=id;render();return}
 if(a==='detail'){ui.detail=id;render();return}
  if(a==='crane-tab'){if(current().type==='loc'&&level(current().id)===1&&['info','assembly'].includes(id)){ui.detail=id;render()}return}
  if(a==='assembly-expand'){ui.assemblyExpanded.has(id)?ui.assemblyExpanded.delete(id):ui.assemblyExpanded.add(id);render();return}
  if(a==='assembly-open-all'){db.locations.forEach(x=>ui.assemblyExpanded.add(x.id));render();return}
  if(a==='assembly-close-all'){ui.assemblyExpanded.clear();render();return}
  if(a==='assembly-select'){ui.assemblySelected=id;render();return}
  if(a==='assembly-replace'){openReplacement(ui.assemblySelected);return}
 if(a==='grid-next'){ui.gridPage++;render();return}if(a==='grid-prev'){ui.gridPage=Math.max(1,ui.gridPage-1);render();return}
 if(a==='grid-edit'){if(ui.checked.size===1)openNode([...ui.checked][0]);return}
 if(a==='grid-add-child'){if(ui.checked.size===1)openNode('',[...ui.checked][0]);return}
 if(a==='close-modal'){closeModal();return}
 if(a==='new-node'){openNode('',t.dataset.parent||'');return}if(a==='edit-node'){openNode(id);return}
 if(a==='new-component'){openComponent();return}if(a==='edit-component'){openComponent(id);return}
 if(a==='movement'){openMovement(id,slot);return}
 if(a==='new-wo'){let cur=current();openWO(id||(ui.detailOpen&&cur.type==='cmp'?cur.id:''),slot||(ui.detailOpen&&cur.type==='loc'?cur.id:''));return}
 if(a==='edit-wo'){openWO(id,'',true);return}
 if(a==='new-cost'){let cur=current();openCost(id||(ui.detailOpen&&cur.type==='cmp'?cur.id:''));return}
 if(a==='more'){dataModal();return}if(a==='export'){exportJSON();return}
 if(a==='import'){document.getElementById('import-file')?.click();return}
 if(a==='reset'){if(confirm('Khôi phục toàn bộ dữ liệu mẫu? Tất cả thay đổi trong trình duyệt sẽ bị xóa. Hãy xuất JSON trước nếu cần giữ.')){db=seed();migratePublicAssetCodes(db);ensureMeters(db);ensureFiveCraneDemo(db);ensureOtherSpreaderMeters(db);ui.meterComponentId='';ui.meterDefId='';save();closeModal();ui.page='assets';ui.selected='loc:crane';ui.detail='info';ui.detailOpen=false;ui.checked.clear();render();toast('Đã khôi phục dữ liệu mẫu.')}return}
 if(a==='share'){shareLink();return}
});
document.addEventListener('submit',ev=>{if(ev.target.id==='modal-form'){ev.preventDefault();processForm(ev.target)}});
document.addEventListener('change',ev=>{
 let t=ev.target;
 if(t.matches('[data-check]')){t.checked?ui.checked.add(t.dataset.check):ui.checked.delete(t.dataset.check);render();return}
 if(t.id==='check-all'){let visible=visibleTree().slice((ui.gridPage-1)*ui.gridPageSize,ui.gridPage*ui.gridPageSize);for(let l of visible){t.checked?ui.checked.add(l.id):ui.checked.delete(l.id)}render();return}
 if(t.id==='meter-component-select'){ui.meterComponentId=t.value;ui.meterDefId='';render();return}
 if(t.id==='grid-level'){ui.gridLevel=t.value;ui.gridPage=1;render();return}
 if(t.id==='grid-status'){ui.gridStatus=t.value;ui.gridPage=1;render();return}
 if(t.id==='grid-page-size'){ui.gridPageSize=Number(t.value)||20;ui.gridPage=1;render();return}
  if(t.id==='import-file')importJSON(t.files[0]);
  if(t.matches('[data-assembly-choice]')){ui.assemblySelected=t.value;render();return}
  if(t.closest('#modal-form')?.dataset.form==='replacement'&&t.name==='target')updateReplacementHint();
 if(t.closest('#modal-form')?.dataset.form==='replacement'&&t.name==='replacementId')refreshReplacementCostSelector(t.closest('form'),node(t.closest('form').elements.target.value));
 if(t.closest('#modal-form')?.dataset.form==='wo-replacement'&&t.name==='replacementId')refreshReplacementCostSelector(t.closest('form'),node(t.closest('form').elements.target.value));
 if(t.id==='wo-slot'){ui.woReplacementSlot=t.value;render();return}
 if(t.id==='parts-kind'){ui.partKind=t.value;render()}
 if(t.id==='parts-status'){ui.partStatus=t.value;render()}
 if(t.closest('#modal-form')?.dataset.form==='movement'&&['componentId','operation'].includes(t.name))updateMoveHint();
 if(t.closest('#modal-form')?.dataset.form==='wo'&&['movementOperation','componentId','locationId'].includes(t.name))updateWOHint()
});
document.addEventListener('input',ev=>{let t=ev.target,mapping={'grid-search':'gridSearch','tree-search':'treeSearch','parts-search':'partSearch','log-search':'logSearch','wo-search':'woSearch'};if(mapping[t.id]){let id=t.id,p=t.selectionStart;ui[mapping[id]]=t.value;if(id==='grid-search')ui.gridPage=1;render();let el=document.getElementById(id);if(el){el.focus();if(t.type!=='search')try{el.setSelectionRange(p,p)}catch{}}}});
document.addEventListener('keydown',ev=>{if(ev.key==='Escape'){if(document.querySelector('.modal-overlay'))closeModal();else if(ui.woOpen){ui.woOpen=false;render()}else if(ui.detailOpen){ui.detailOpen=false;render()}}});
if(captureMissingCraneSnapshots())save();
readHash();render();
})();
