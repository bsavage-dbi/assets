pm.collectionVariables.set("THEME", "DBICBP-581"); // DC-AUGUST-ONE-2021
pm.collectionVariables.set('JQL', 'project = "DC" AND issuetype in ("Theme [DBICBP]","Theme",Initiative,"Initiative [DBICBP]", "Epic", "Story")');

//pm.collectionVariables.set('JQL', 'project = "DC" AND issuetype in ("Theme [DBICBP]","Theme",Initiative,"Initiative [DBICBP]") AND "Confluence Page ID[Short text]" is not EMPTY'); 
// https://stackoverflow.com/questions/45673961/how-to-write-global-functions-in-postman
// Initialize environment (or globals) :

postman.setEnvironmentVariable("utils", () => {

    var buildOverview = (key, isum, idesc, ioverview, itype) => {

        const stats = {};

        let obuild = "h1. " + isum + "\n" + idesc + "\n";

        stats[key] = {
            key: key,
            id: isum,
            issueType: itype,
            old_overview_min: JSON.stringify(ioverview),
            new_overview_min: JSON.stringify(obuild)
        };
        let objName = itype.toUpperCase();
        // console.log(objName);
        objName.replace(" ", "_");

        // console.log(objName);
        pm.collectionVariables.set("" + objName + "_OBJ", obuild);
        // console.log(stats);

        pm.collectionVariables.set("THEME_SUM", isum);

        pm.collectionVariables.set("THEME_DESC", idesc);

        pm.collectionVariables.set("THEME_OLD_PROJECT_OVERVIEW", ioverview);

        // pm.collectionVariables.set("THEME_PROJECT_OVERVIEW", obuild); 

        return key + " " + isum + " " + "h1. " + isum + "\n" + idesc + "\n";
    }
    var ShowObjectProperties = (obj) => {
        for (var prop in obj) {
            // console.log(prop + ": " + obj[prop] + "\n" );
        }
    }
    var getLinkedIssues = (obj) => {

        let inOut = (obj.inwardIssue === Object(obj.inwardIssue)) ? "inwardIssue" : "outwardIssue";
        let conContain = `<a href=\"https://davidsbridal.atlassian.net/browse/${obj[inOut].key}" data-card-appearance="inline" class="external-link" rel="nofollow">https://davidsbridal.atlassian.net/browse/${obj[inOut].key}</a>`;

        // console.log(obj[inOut].fields.summary);

        /*
        for (const link of obj) {
            epics = (issueTypeID == "10004") ? epics + '<div>  <span class=\"icon\" style=\"\"><img src=\"https://davidsbridal.atlassian.net/wiki/download/attachments/2469855287/' + issueTypeID + '.png?api=v2\" style=\"border: 0.0px solid black;\"  width=\"14px\" /></span>  ' + issueSummary + '<a href="https://davidsbridal.atlassian.net/browse/'+issueKey+'" target="blank"> <sup>' + curis.key + '</sup></a></div>' : epics;
        }
        */
        return conContain;

    }
    var getObjVar = (vname, vtype) => {
        let retObj;
        if (vtype === "v") { // get variable
            retObj = pm.variables.get(JSON.parse(vname));
        } else if (vtype === "c") { // get collection variable
            retObj = pm.collectionVariables.get(JSON.parse(vname));
        } else if (vtype === "e") { // get environment variable
            retObj = pm.environment.get(JSON.parse(vname));
        } else if (vtype === "g") { // get global variable
            retObj = pm.globals.get(JSON.parse(vname));
        } else {
            retObj = pm.collectionVariables.get(JSON.parse(vname));
        }
        return retObj;
    }
    var setObjVar = (obj, vname, vtype) => {
        if (vtype === "v") { // set variable
            pm.variables.set(vname, JSON.stringify(obj));
        } else if (vtype === "c") { // set collection variable
            pm.collectionVariables.set(vname, JSON.stringify(obj));
        } else if (vtype === "e") { // set environment variable
            pm.environment.set(vname, JSON.stringify(obj));
        } else if (vtype === "g") { // set global variable
            pm.globals.set(vname, JSON.stringify(obj));
        } else { // set collection variable
            pm.collectionVariables.set(vname, JSON.stringify(obj));
        }
    }
    var createProjectOverview = (obj) => {

        let oFields = obj.fields;
        let oRFields = obj.renderedFields;
        let obuild = "h1. " + oFields.summary + "\n" + oRFields.description + "\n";

        return obuild;

    }
    var createInititivesOverview = (obj) => {

        let oFields = obj[0].fields;
        let oRFields = obj[0].renderedFields;
        let issuelinks = obj[0].fields.issuelinks;
        let obuild = "h2. " + oFields.summary + "\n" + oRFields.description + "\n";
        obuild = obuild + "h3. Epics\n";

        for (const link of issuelinks) {
            let inOut = (link.inwardIssue === Object(link.inwardIssue)) ? "inwardIssue" : "outwardIssue";
            obuild = obuild + link;
        }

        return obuild;
    }
    var createEpicsOverview = (obj) => {}
    var createCommunicationUpdates = (obj) => {}
    var createLinkedIssuesObj = (obj, reqIssue) => {
        //https://www.freecodecamp.org/news/javascript-array-of-objects-tutorial-how-to-create-update-and-loop-through-objects-using-js-array-methods/
        const issues = [];
        for (const element of obj) {
            let inOut = (element.inwardIssue === Object(element.inwardIssue)) ? "inwardIssue" : "outwardIssue";
            let iot = (element.inwardIssue === Object(element.inwardIssue)) ? element.type.inward : element.type.outward;
            parent = (iot === "Parent Of") ? reqIssue : null;
            issues.push({
                key: element[inOut].key,
                parent: parent,
                linkedTo: reqIssue,
                issuetype: element[inOut].fields.issuetype.name,
                summary: element[inOut].fields.summary,
                status: element[inOut].fields.status.name
            });
        }
        toS = JSON.stringify(issues);
        toO = JSON.parse(toS);
        return toO;
    }
    var createIssuesObjPackage = (obj) => {

        const issues = [];
        for (const element of obj) {
            let conPG = (element.fields.customfield_11681 !== "") ? element.fields.customfield_11681 : false;
            let conPGPAR = (element.fields.customfield_11683 !== "") ? element.fields.customfield_11683 : false;
            let links = createLinkedIssuesObj(element.fields.issuelinks, element.key);
            let ik = '';
            issues.push({
                key: element.key,
                issuetype: element.fields.issuetype.name,
                summary: element.fields.summary,
                confluPg: conPG,
                confluPgPar: conPGPAR,
                start: element.fields.customfield_11221,
                due: element.fields.duedate,
                tstart: element.fields.customfield_11419,
                tend: element.fields.customfield_11420,
                description: element.fields.description,
                wOver: createProjectOverview(element),
                links: links
            });
        }
        return issues;
    }
    return {
        myPackage: {
            buildOverview,
            ShowObjectProperties,
            getLinkedIssues,
            getObjVar,
            setObjVar,
            createProjectOverview,
            createInititivesOverview,
            createEpicsOverview,
            createCommunicationUpdates,
            createLinkedIssuesObj,
            createIssuesObjPackage
        }
    };
});

/*
And then use your functions in a later test :

let utils = eval(environment.utils)();
utils.myPackage.myFunction1(); //calls myFunction1()
utils.myPackage.myFunction2(); //calls myFunction2() which uses myFunction1()
*/





// Text Message Details - Issue Details

// Issue id
//pm.collectionVariables.set("ISSUE_ID", jsonData.fields.id);

// Issue self ( REST LINK )
//pm.collectionVariables.set("ISSUE_LINK", jsonData.fields.self);

// Issue key
//pm.collectionVariables.set("ISSUE_KEY", jsonData.fields.key);

// Issue updated
//pm.collectionVariables.set("ISSUE_LAST_UPDASTED", jsonData.fields.updated);

// Text Message Details - Issue Content

// Issue description
//pm.collectionVariables.set("ISSUE_DESCRIPTION", jsonData.fields.description);

// Issue Text Message summary
//pm.collectionVariables.set("ISSUE_SUMMARY", jsonData.fields.summary);

// Issue Text Message Content
// pm.collectionVariables.set("ISSUE_TEXT_MSG_CONTENT", jsonData.fields.customfield_11574);

// Issue Text Message Version
// pm.collectionVariables.set("ISSUE_TEXT_MSG_VERSION", jsonData.fields.customfield_11659);

// Text Message Details - Issue Type

// Issue issuetype id
//pm.collectionVariables.set("STATUS_ID", jsonData.fields.issuetype.id);

// Issue issuetype name
//pm.collectionVariables.set("STATUS_NAME", jsonData.fields.issuetype.name);

// Text Message Details - Sprint

// Issue Sprint - Sprint ID
//pm.collectionVariables.set("SPRINT_ID", jsonData.fields.customfield_10122.id);

// Issue Sprint - Sprint Name
//pm.collectionVariables.set("SPRINT_NAME", jsonData.fields.customfield_10122.name);

// Issue Sprint - Sprint State
//pm.collectionVariables.set("SPRINT_STATE", jsonData.fields.customfield_10122.state);

// Issue Sprint - Sprint Board ID
//pm.collectionVariables.set("SPRINT_BOARD_ID", jsonData.fields.customfield_10122.boardId);

// Text Message Details - Epic

// Issue Epic Link (key)
//pm.collectionVariables.set("EPIC_LINK_KEY", jsonData.fields.customfield_10118);

// Text Message Details - Links

// Issue Epic Link (key)
//pm.collectionVariables.set("EPIC_LINK_KEY", jsonData.fields.customfield_10118);


// NEEDS REVIEWED AND CLEANED

// Issue 
//pm.collectionVariables.set("QA_ESTIMATE", jsonData.fields.customfield_10501); // QA Estimate",

// Issue 
//pm.collectionVariables.set("DEV_ESTIMATE", jsonData.fields.customfield_10502); // Dev Estimate",

// Issue 
//pm.collectionVariables.set("LABELS", jsonData.fields.labels); // Labels",


// Issue 
//pm.collectionVariables.set("COMPONENTS", jsonData.fields.components); // Components",


// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11591); // Second Test Product",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11470); // Benefit",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11590); // First Test Product",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11593); // Mitigation Strategy",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11471); // Blocked By",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.subtasks); // Sub-tasks",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11492); // Definition of Done",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11371); // Label",        

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11493); // Use Case Name",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11247); // Issue color",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_10700); // Flagged",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11591); // Second Test Product",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11470); // Benefit",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11590); // First Test Product",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11592); // Third Test Product",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11595); // Delivery Team",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11474); // Compliance Support",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11596); // General Support Link",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11599); // QA ENV 1 Link",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11357); // Implementation End",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11598); // STG ENV 1 Link",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11356); // Implementation Start",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11226); // Remaining Points",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11469); // Feature",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11227); // Phase",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11468); // Effort Type",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11589); // Liveperson Skill",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11228); // Request participants",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11229); // Severity",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.updated); // Updated",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11580); // Use Case Actors [DBICB]",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.timeoriginalestimate); // Original estimate",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11340); // SD Customer Name",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11460); // Estimated % of Work Completed",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11463); // Assigned To",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11584); // Liveperson Skill ID",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11220); // MoSCoW",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11341); // SD Customer Phone Number",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11583); // SMS/Text Device",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11462); // T-Shirt Size - Remaining Work",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11221); // Start date",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11100); // Story Points",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11586); // Liveperson Skill Name",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11465); // Use Case Actor",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11222); // Category (Analytics)",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11223); // Business Unit",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11343); // Time to Close",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11585); // Skill Transfer List",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11464); // Change Request Submitter",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11224); // Environment (Analytics)",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11346); // SD Enterprise DBA Sub-Category",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11467); // Database Component Implementation Priority",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11588); // Store Number:",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11225); // Issue",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11587); // External Test Resource",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.timetracking); // Time tracking",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11215); // Approved By Finance",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11579); // Use Case Assets",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11458); // Was QA Verification Completed By Someone Other Than The Engineer(s) That Built This Change?",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11457); // Change Owner",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_10127); // Category",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11216); // Easy Vista Ticket #",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11578); // Use Case Overview",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11459); // Change Request Type",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_10800); // Request Type",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11219); // https component",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11450); // MVP",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11573); // Requirement Type",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11452); // DBA Team Confirm",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_10000); // Development",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11451); // Stakeholders",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11454); // Security Team Confirm",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11211); // High Level Estimate.",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_10122); // Sprint",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11574); // Text Message Content",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11453); // Server Team Confirm",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11212); // Requesting Department",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_10123); // Rank",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11456); // BI Team Confirm",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11213); // T-Shirt Size - Complete LOE",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11455); // Auditing Team Confirm",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11214); // Above The Line",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11204); // Level of Effort",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11447); // Has The Service Desk/Desktop Support Been Notified?",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11568); // Assumptions [ DBC ]",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11205); // Support Level",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11567); // Use Case Assets [ DBI Chat Bot ]",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11446); // Was the Security Checklist Completed and Recorded?",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_10117); // Approvals",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.environment); // Environment",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11449); // Business Owner Notified of Pending Change?",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11206); // Urgency",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_10118); // Epic Link",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11448); // Deployment Testing Successful?",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11208); // Reference Number",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.duedate); // Due date",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.comment); // Comment",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.statuscategorychangedate); // Status Category Changed",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11441); // Error Code",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.fixVersions); // Fix versions",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11443); // Error Type",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11200); // Initiative",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11321); // Urgency",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11322); // Assignment Group",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11442); // Repository Name",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11201); // Type",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11445); // Associated Born Jira Ticket Data Dump",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11202); // Watchers",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11203); // High Level Estimate",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11444); // Associated Born Jira Ticket",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11435); // CM - Group 2 Approved",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11438); // Test Resources & Information",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11316); // Impact",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11437); // Story Map",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_10900); // Business Description",

// Issue Epics Overview
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11670); // Epics Overview",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11430); // Grooming Status",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11671); // Architect Lead",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.priority); // Priority",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11432); // CM - Authorizing Manager V",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_10100); // [CHART] Date of First Response",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11311); // Source",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11431); // CM - Authorizing Manager IV",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_10101); // [CHART] Time in Status",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11434); // CM - Group 1 Approved",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11312); // Urgency",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_10102); // Team",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11313); // Product categorization",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11433); // CAB Approval Test",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_10103); // Parent Link",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11303); // Root cause",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11667); // Business Owner",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11666); // Technical Lead",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11304); // Workaround",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11424); // Change Request End Date - SF",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11669); // Product Manager",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11305); // Urgency",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11668); // Security Owner",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11306); // Pending reason",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.timeestimate); // Remaining Estimate",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11429); // Technical Components",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11307); // Product categorization",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11308); // Operational categorization",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.versions); // Affects versions",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.status); // Status",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11540); // Value Statement (DC)",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11661); // Text Message Overview",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11660); // Project Focus",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11542); // Delivery Health (DC)",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11663); // Open QA Questions & Action Items",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11421); // Need Feedback From",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11541); // Progress Notes (DC)",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11420); // Target end",

// Issue Initiative Overvie
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11662); // Initiative Overview",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11423); // Change Request Start Date - SF",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11301); // Source",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11665); // QA Lead",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11302); // Investigation reason",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11422); // Requirements",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11664); // Sponsor",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11543); // Resources Aligned to Ticket (DC)",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11535); // Include In Demo (DC)",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11656); // Deployment Steps",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11655); // QA History Log",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11534); // Communication Updates (DC)",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11416); // CM - Database Component - Old II",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11537); // Demo Highlights & Additional Details (DC)",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11658); // Additional Developer Notes & Information",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11536); // Demo Presenter (DC)",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11657); // Deployment Notes",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.aggregatetimeestimate); // Σ Remaining Estimate",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11538); // Demo Approved (DC)",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11417); // Database Component",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11659); // Text Message Version",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11419); // Target start",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.creator); // Creator",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.aggregateprogress); // Σ Progress",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11531); // Initiative (DC)",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11651); // QA Updates",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11654); // Development History Log",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11533); // Benefit (DC)",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11532); // Feature (DC)",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11653); // Communications Log",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11524); // Jira Access Description",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11645); // Primary Documentation",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11403); // WHAT I NEED TO MOVE FORWARD",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11402); // I NEED THIS TO MOVE FORWARD",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11523); // NAV Access Description",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11644); // Impacted Geographic Regions",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11526); // WM Access",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11647); // QA Assignees",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11646); // Supporting Developers",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11525); // DOM Access Description",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11649); // Assets Test",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11528); // DOM Access",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11648); // Slack Channel Email Address",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11527); // NAV Access",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11529); // Jira Access",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.timespent); // Time Spent",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11641); // Text Message Update History",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.aggregatetimespent); // Σ Time Spent",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11520); // Department Group",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11640); // Send Communication Updates",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11522); // Department Share Requested",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11643); // Developer Updates",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11642); // API JSON",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11521); // Department Sub Group",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11513); // WM Access Description",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11634); // Checklist Template",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11633); // Checklist Progress %",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11512); // Discount Type",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11636); // Checklist Content YAML",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11635); // Checklist Completed",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11514); // Team Member Name",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11517); // Team Member Manager",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11637); // Checklist Text",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11516); // Start Date",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11519); // AD Account Required",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11518); // Team Member Type",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11639); // Task Owners",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.workratio); // Work Ratio",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.issuerestriction); // Restrict to",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.created); // Created",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11630); // Access Requests",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11632); // Checklist Progress",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11511); // CyberSource Status",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_10300); // IT Risk",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_10301); // Business Benefit",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11510); // Product Types",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11631); // Submit a Support Requests",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11623); // Next Steps",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11622); // PRD ENV 3 Link",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11504); // Distribution Point",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11625); // Liveperson ChatBot Name",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11624); // Solution Design Document",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11627); // Liveperson ChatBot Type",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11506); // Transaction Process",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11626); // Liveperson ChatBot ID",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11505); // Order Origin",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11629); // System Support Teams",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11508); // Shipping Method",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11507); // Payment Type",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11628); // System Owners",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11509); // Shipping Location (Tax-Ship To)",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11621); // PRD ENV 2 Link",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11620); // PRD ENV 1 Link",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11612); // STG ENV 3 Link",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11611); // STG ENV 2 Link",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.security); // Security Level",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11614); // QA ENV 3 Information",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11613); // QA ENV 2 Information",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.attachment); // Attachment",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11616); // QA ENV 3 Link",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11615); // QA ENV 2 Link",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11618); // PRD ENV 2 Information",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11617); // PRD ENV 1 Information",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11619); // PRD ENV 3 Information",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11291); // Service Desk Machine Name-ID",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11293); // Level-1 - Service Desk Sub-Categories",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11294); // Not Used - DBA Support - Sub-Category",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11295); // Access or Permission Issues - Sub-Categories",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11296); // Personal Computer or Device Issues - Sub-Categories",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11297); // Store Systems Sub-Categories",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11298); // Operational categorization",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11610); // STG ENV 3 Information",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_10400); // Organizations",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11601); // QA ENV 1 Information",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11603); // DEV ENV 1 Information",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11602); // STG ENV 1 Information",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11605); // DEV ENV 2 Link",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11604); // Official Knowledge Resource",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11607); // DEV ENV 3 Information",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11606); // DEV ENV 2 Information",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11609); // STG ENV 2 Information",

// Issue 
// pm.collectionVariables.set("XXX", jsonData.fields.customfield_11608); // DEV ENV 3 Link"