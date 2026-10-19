/* WhatsApp prefill + simple validation. */
(function () {
  'use strict';
  var form, STORE_KEY='yk_enquiry_draft', draftTimer=null;

  function t(k){ return k; } // keep minimal; form text hardcoded small or can be enhanced
  function esc(v){ return String(v||''); }
  function digits(v){ return String(v||'').replace(/\D/g,''); }
  function waUrl(msg){ var n='9779804331857', m=msg||'Hello Yagya Krishi Udhyog'; return 'https://wa.me/'+n+'?text='+encodeURIComponent(m); }
  function refreshWa(){ var links=document.querySelectorAll('[data-wa-link]'); for(var i=0;i<links.length;i++){ var c=links[i].getAttribute('data-wa-message'); links[i].setAttribute('href',waUrl(c)); } }

  function fieldInput(name){ var w=document.querySelector('.field[data-field="'+name+'"]'); return w?w.querySelector('input,select,textarea'):null; }
  function mark(n,k){ var w=document.querySelector('.field[data-field="'+n+'"]'); if(w)w.classList.add('is-invalid'); var e=document.getElementById('err-'+n); if(e)e.textContent=k; }
  function clear(n){ var w=document.querySelector('.field[data-field="'+n+'"]'); if(w)w.classList.remove('is-invalid'); var e=document.getElementById('err-'+n); if(e)e.textContent=''; }

  function validate(){
    var invalid=[]; var rules={
      name:function(v){ if(!v.trim()||v.trim().length<2)return 'Required'; return ''; },
      phone:function(v){ if(!v.trim())return 'Required'; if(digits(v).length<7||digits(v).length>15)return 'Invalid'; return ''; },
      email:function(v){ if(!v.trim())return ''; if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()))return 'Invalid'; return ''; },
      interest:function(v){ return v?'':'Required'; },
      message:function(v){ if(!v.trim()||v.trim().length<5)return 'Required'; return ''; }
    };
    ['name','phone','email','interest','message'].forEach(function(n){
      var inp=fieldInput(n), r=rules[n]; if(!inp||!r)return;
      var err=r(inp.value); if(err){ mark(n,err); invalid.push(n); } else clear(n);
    });
    return invalid;
  }

  function build(){
    var name=(fieldInput('name')||{value:''}).value.trim();
    var phone=(fieldInput('phone')||{value:''}).value.trim();
    var email=(fieldInput('email')||{value:''}).value.trim();
    var loc=(fieldInput('location')||{value:''}).value.trim();
    var ie=fieldInput('interest'), iv='';
    if(ie&&ie.selectedIndex>=0) iv=(ie.options[ie.selectedIndex].textContent||'').trim();
    var msg=(fieldInput('message')||{value:''}).value.trim();
    var lines=['Hello Yagya Krishi Udhyog,',''];
    if(name)lines.push('Name: '+name); if(phone)lines.push('Phone: '+phone); if(email)lines.push('Email: '+email); if(loc)lines.push('Location: '+loc); if(iv)lines.push('Interest: '+iv);
    if(msg) lines.push('Message: '+msg);
    lines.push('');
    lines.push('Please contact me regarding my enquiry.');
    return lines.join('\n');
  }

  function readDraft(){ try{ var r=localStorage.getItem(STORE_KEY); return r?JSON.parse(r):null; }catch(e){return null;} }
  function saveDraft(){ var data={name:(fieldInput('name')||{}).value,phone:(fieldInput('phone')||{}).value,email:(fieldInput('email')||{}).value,location:(fieldInput('location')||{}).value,interest:(fieldInput('interest')||{}).value,message:(fieldInput('message')||{}).value}; try{localStorage.setItem(STORE_KEY,JSON.stringify(data));}catch(e){} }
  function applyDraft(d){ if(!d)return; ['name','phone','email','location','interest','message'].forEach(function(n){ var inp=fieldInput(n); if(inp&&!inp.value&&d[n])inp.value=d[n]; }); }
  function applyQuery(){ var p=new URLSearchParams(location.search), it=p.get('interest'), it2=p.get('item'); var s=fieldInput('interest'); if(it&&s){ for(var i=0;i<s.options.length;i++)if(s.options[i].value===it){s.value=it;break;} } var m=fieldInput('message'); if(it2&&m&&!m.value){ m.value='Enquiry about: '+decodeURIComponent(it2); } }

  function init(){
    refreshWa();
    form=document.getElementById('lead-form');
    if(!form)return;
    form.setAttribute('action',waUrl(''));
    form.setAttribute('target','_blank');
    form.setAttribute('method','get');
    applyDraft(readDraft()); applyQuery();
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var inv=validate();
      var box=document.getElementById('form-errors');
      var success=document.getElementById('form-success');
      if(inv.length){
        if(box){ box.textContent='Please correct the highlighted fields below.'; box.classList.add('is-visible'); box.focus(); }
        if(success) success.classList.remove('is-visible');
        return;
      }
      if(box) box.classList.remove('is-visible');
      var msg=build();
      window.open(waUrl(msg),'_blank','noopener');
      if(success){
        var link=success.querySelector('a');
        if(link) link.setAttribute('href',waUrl(msg));
        success.classList.add('is-visible');
      }
      clearTimeout(draftTimer);
      try{localStorage.removeItem(STORE_KEY);}catch(e2){}
    });
    ['name','phone','email','location','interest','message'].forEach(function(n){
      var inp=fieldInput(n); if(!inp)return;
      inp.addEventListener('input',function(){ clear(n); clearTimeout(draftTimer); draftTimer=setTimeout(saveDraft,500); });
      inp.addEventListener('change',function(){ clear(n); clearTimeout(draftTimer); draftTimer=setTimeout(saveDraft,500); });
    });
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init); else init();
})();
