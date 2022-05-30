// 선택자 할당
let addBtn = document.querySelector('.addBtn')
let addTxt = document.querySelector('.addTxt')
let listBox_inner = document.querySelector('.listBox_inner')
let delBtnEls = document.querySelectorAll('.delBtn')
let listEls = document.querySelectorAll('.list')
let allBtn = document.querySelector('.btn-all')
let beforeBtn = document.querySelector('.btn-before')
let afterBtn = document.querySelector('.btn-after')
let listCheck = document.querySelectorAll('.listCheck');
let allDel = document.querySelector('.allDel')
let allSelect = document.querySelector('.allSelect')


// 리스트 추가1 - 'enter'버튼으로 추가하기
addTxt.addEventListener('keyup', function(e) {

    if(e.key === 'Enter') {
        addList()  
    }

    checkList()
    delList()
    listCount()

})


// 리스트 추가2 - 추가(+)버튼으로 추가하기
addBtn.addEventListener('click', function() {
    
    addList()
    checkList()
    delList()
    listCount()

});


// addTxt 입력창 null값 판단
function addList() {

    if(addTxt.value !== "") {
        
        // list를 출력할 <div> 요소생성
        let list = document.createElement('div')
        list.setAttribute("class", "list")
        list.innerHTML = `<label class="listLb"><input type="checkbox" class="listCheck">${addTxt.value}</label><button class="delBtn">x</button>`
        
        listBox_inner.appendChild(list)        
        addTxt.value= ''
        addTxt.style.borderBottom = '1px solid rgb(163, 155, 155)'
        
        if(document.querySelector('.notice')) {
             // 경고 메시지 <div>가 생성되어있는 경우 - 요소삭제(removeChild)
            addBox = document.querySelector('.addBox')
            let notice = document.querySelector('.notice')
            addBox.removeChild(notice)  
        } else {
            // 경고 메시지 <div>가 생성되어있지 않은 경우
        }       
        
    } else {
       
        // 텍스트 미입력시 경고 메시지 출력할 <div> 요소생성
        let noticeEl = document.createElement('div')
        noticeEl.setAttribute('class', 'notice')
        noticeEl.innerHTML = '<span>&nbsp&nbsp&nbsp&nbsp&nbsp * 내용을 입력해주세요</span>'

        addTxt.style.borderBottom = '1px solid rgb(201, 65, 65)'
        

        if(document.querySelector('.notice')) {
            // 경고 메시지 <div>가 생성되어있는 경우
        } else {
            // 경고 메시지 <div>가 생성되어있지 않은 경우 - 요소추가(appendChild)
            addBox = document.querySelector('.addBox')
            addBox.appendChild(noticeEl)
        }

    }
}


// 리스트 체크(완료처리)
function checkList() {

    listCheck = document.querySelectorAll('.listCheck')
    let listLb = document.querySelectorAll('.listLb')

    listCheck.forEach((listEl, index) => listEl.addEventListener('click', function(){
            
        if(listEl.checked == true) {
            listLb[index].style.textDecoration = "line-through"
            listLb[index].style.textDecorationColor = "red"
        } else {
            listLb[index].style.textDecoration = "none"
        }

        listCount();
    }))
}


// 리스트 삭제
function delList() {
    
    delBtnEls = document.querySelectorAll('.delBtn')
    listEls = document.querySelectorAll('.list')

    delBtnEls.forEach((delEl, index) => delEl.addEventListener('click', function() {
        
        listEls[index].remove()
        
    }))

    listCount()

}


// 전체조회
allBtn.addEventListener('click', function() {

    // document.querySelector('.listBox_inner').textContent = ""
    // console.log(document.querySelector('.listBox_inner'))

    listEls = document.querySelectorAll('.list')
    
    listEls.forEach(listEl => {
        listEl.style.display = ""
    });
    
})


// 진행중 조회
beforeBtn.addEventListener('click', function() {

    listEls = document.querySelectorAll('.list')

    for(let i=0; i<listCheck.length; i++) {
        
        if(listCheck[i].checked == true) {
            listEls[i].style.display = "none"
        } else {
            listEls[i].style.display = ""
        }
    }

})


// 완료 조회
afterBtn.addEventListener('click', function() {

    listEls = document.querySelectorAll('.list')

    for(let i=0; i<listEls.length; i++) {
        if(listCheck[i].checked == true) {
            listEls[i].style.display = ""
        } else {
            listEls[i].style.display = "none"
        }
    }

})

// 조회 건수
function listCount() {

    let beforeArray = [];
    let afterArray = [];

    // 전체
    listEls = document.querySelectorAll('.list')

    for(let i=0; i<listEls.length; i++) {   // listCheck로 받으려면 재할당 명시해줘야함
        
        if(listCheck[i].checked == false) {
            // 진행중
            beforeArray.push(listEls[i])        
        }  else {
            // 완료
            afterArray.push(listEls[i])
        }
    }
    
    let beforeCount = beforeArray.length
    let afterCount = afterArray.length
    let allCount = beforeCount + afterCount

    allBtn.value = '전체 : ' + allCount
    beforeBtn.value =  '진행중 : ' + beforeCount 
    afterBtn.value = '완료 : ' + afterCount

}




// 전체선택
allSelect.addEventListener('click', function() {

    listCheck = document.querySelectorAll('.listCheck')
    listLb = document.querySelectorAll('.listLb')

    if(allSelect.checked == true) { // 전체선택 체크

        for(let i=0; i<listCheck.length; i++) {
            listCheck[i].checked = true;
            listLb[i].style.textDecoration = "line-through"
        }

    } else {    // 전체선택 해제

        for(let i=0; i<listCheck.length; i++) {
            listCheck[i].checked = false;
            listLb[i].style.textDecoration = "none"
        }

    }

    listCount()

})




// 전체삭제
allDel.addEventListener('click', function() {

    listBox_inner.innerHTML = ''
    allSelect.checked = false
    listCount()

})