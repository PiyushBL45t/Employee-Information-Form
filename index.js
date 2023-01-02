/**
 *          This project focuses on making a conncetion with the
 *          JSONPowerDB database and send and retrieve the information from it.
 */

// variables for a global access
var jpdbBaseURL = "http://api.login2explore.com:5577"; // JSONPowerDB base URL
var jpdbIML = "/api/iml"; // iml link
var jpdbIRL = "/api/irl"; // irl link
var empDBName = "Employee"; // database name
var EmpRelationName = "EMP-REL"; // database relation name
var connToken = 'your_connection_token'; // connection token for the database


// Saving the record number to Local Storage
function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data).record;
    localStorage.setItem("recno", lvData.rec_no);
}

// function to validate the form data
function validateData() {
    var empIdVar = $("#empId").val();
    if (empIdVar === "") {
        alert("Employee ID Required Value");
        $("#empId").focus();
        return "";
    }
    var empNameVar = $("#empName").val();
    if (empNameVar === "") {
        alert("Employee Name is Required Value");
        $("#empName").focus();
        return "";
    }
    var empSalaryVar = $("#empSalary").val();
    if (empSalaryVar === "") {
        alert("Employee Salary is Required Value");
        $("#empSalary").focus();
        return "";
    }

    var empHraVar = $("#empHra").val();
    if (empHraVar === "") {
        alert("Employee HRA is Required Value");
        $("#empHra").focus();
        return "";
    }

    var empDaVar = $("#empDa").val();
    if (empDaVar === "") {
        alert("Employee DA is Required Value");
        $("#empDa").focus();
        return "";
    }

    var empDeductionVar = $("#empDeduction").val();
    if (empDeductionVar === "") {
        alert("Employee Deduction is Required Value");
        $("#empDeduction").focus();
        return "";
    }

    var jsonStrObj = {
        empId: empIdVar,
        empName: empNameVar,
        empSalary: empSalaryVar,
        empHra: empHraVar,
        empDA: empDaVar,
        empDeduction: empDeductionVar
    };

    return JSON.stringify(jsonStrObj);
}


// function to fill the data for implementation in form
function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var data = JSON.parse(jsonObj.data).record;
    $("#empName").val(data.name);
    $("#empSalary").val(data.salary);
    $("#empHra").val(data.hra);
    $("#empDa").val(data.da);
    $("#empDeduction").val(data.deduction);

}

// function to get employee ID as JSON
function getEmpIdAsJson() {
    var empId = $("#empId").val();
    var jsonStr = {
        id: empId
    };
    return JSON.stringify(jsonStr);
}

// function to get the employee data
function getEmp() {
    var empIdJsonObj = getEmpIdAsJson();
    console.log(empIdJsonObj);
    var getRequest = createGET_BY_KEYRequest(connToken, empDBName, EmpRelationName, empIdJsonObj);
    console.log(getRequest);
    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    console.log(resJsonObj);
    jQuery.ajaxSetup({ async: true });

    if (resJsonObj.status === 400) {
        $("#empSave").prop("disabled", false);
        $("#empReset").prop("disabled", false);
        $("#empName").focus();
    } else if (resJsonObj === 200) {
        $("#empId").prop("disabled", true)
        fillData(resJsonObj);

        $("#empChange").prop("disabled", false);
        $("#empReset").prop("disabled", false);
        $("#empName").focus();
    }

}

// function to change the employee data
function changeData() {
    $("#empChange").prop("disabled", true);
    var jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, empDBName, EmpRelationName, localStorage.getItem("recno"));
    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML)
    jQuery.ajaxSetup({ async: true });
    console.log(resJsonObj);
    resetForm();
    $("#empId").focus();
}

// reset form function
function resetForm() {
    $("#empId").val("");
    $("#empName").val("");
    $("#empSalary").val("");
    $("#empHra").val("");
    $("#empDa").val("");
    $("#empDeduction").val("");
    $("#empId").prop("disabled", false);
    $("#empSave").prop("disabled", true);
    $("#empChange").prop("disabled", true);
    $("#empReset").prop("disabled", true);
    $("#empId").focus();
}
function saveData() {
    var jsonStr = validateAndGetFormData();
    if (jsonStr === "") {
        return;
    }

    // Using JPDB to create request

    var putReqStr = createPUTRequest(connToken, jsonStr, empDBName, EmpRelationName);
    alert(putReqStr);
    jQuery.ajaxSetup({ async: false });

    // Executing The request(through JPDB ).

    var resJsonObj = executeCommandAtGivenBaseUrl(putReqStr, jpdbBaseURL, jpdbIML);
    alert(JSON.stringify(resJsonObj));
    jQuery.ajaxSetup({ async: true });

    // Calling reset function

    resetForm();
    $("#empId").focus();
}
