const moment = require("moment");
let now = moment().format("YYYY-MM-DD");

pm.collectionVariables.set("PROJECT_OVERVIEW_PAGE", JSON.stringify("Poject Overview"));

pm.collectionVariables.set("ACTIVE_PROJECT", "DBIPP");
pm.collectionVariables.set("THEME_START_LOW", now);
pm.collectionVariables.set("THEME_END_HIGH", now);
pm.collectionVariables.set("INITITIVE_START_LOW", now);
pm.collectionVariables.set("INITITIVE_END_HIGH", now);
pm.collectionVariables.set("EPIC_START_LOW", now);
pm.collectionVariables.set("EPIC_END_HIGH", now);
pm.collectionVariables.set("SUBTASK_START_LOW", now);
pm.collectionVariables.set("SUBTASK_END_HIGH", now);

postman.setEnvironmentVariable("utils", () => {

    var createIssueObject = (obj) => {
        let summary = (obj.fields.summary !== null) ? obj.fields.summary : "No summary available.";
        let nextSteps = (obj.fields.customfield_11623 !== null) ? obj.fields.customfield_11623 : "";
        let comUpdates = (obj.fields.customfield_11534 !== null) ? obj.fields.customfield_11534 : "";
        let description = (obj.fields.description !== null) ? obj.fields.description : "No description available.";
        let sc = (obj.fields.status.statusCategory.name === "To Do") ? "gray" : (obj.fields.status.statusCategory.name === "In Progress") ? "blue" : (obj.fields.status.statusCategory.name === "Done") ? "green" : "No description available.";
        let overview = "";
        let timeDateObj = timeKeeper(obj);

        switch (obj.fields.issuetype.id) {
            case "10780": // Theme [DBICBP]
                overview = `
                    h1. ${summary} 
                    {color:${sc}}^*${obj.fields.status.name}*^{color}
                    ^*Start/End Dates:* ${timeDateObj.startDate} - ${timeDateObj.endDate}^
                    ${description}
                    {color:gray}^_*LAST UPDATED: ${timeDateObj.updated}*_^{color}
                `;
                createProjectOverview(overview);
                break;
            case "10781": // Initiative [DBICBP]
                overview = `
                    h2. ${summary}
                    ^*Current Status: {color:${sc}}${obj.fields.status.name}{color}*^
                    ^*Start/End Dates:* ${timeDateObj.startDate} - ${timeDateObj.endDate}^
                    ${description}
                    {color:gray}^_*LAST UPDATED: ${timeDateObj.updated}*_^{color}
                `;
                createProjectOverview(overview);
                break;
            case "10004": // Epic
                overview = `
            h3. ${summary} {color:${sc}}^${obj.fields.status.name}^{color}
            ^*Start/End Dates:* ${timeDateObj.startDate} - ${timeDateObj.endDate}^
            ${description}
            ${(nextSteps.split(" ").length > 2) ? "h5. NEXT STEPS: \n" + nextSteps : ""}
            {color:gray}^_*LAST UPDATED: ${timeDateObj.updated}*_^{color}
        `;
                break;
            case "10000": // Story
                overview = `
        h4. ${summary} {color:${sc}}^${obj.fields.status.name}^{color}
            ^*Start/End Dates:* ${timeDateObj.startDate} - ${timeDateObj.endDate}^
            ${description}
            ${(nextSteps.split(" ").length > 2) ? "h5. NEXT STEPS: \n" + nextSteps : ""}
            {color:gray}^_*LAST UPDATED: ${timeDateObj.updated}*_^{color}
        `;
                break;
            default:
                overview = `
            h4. ${summary} {color:${sc}}^${obj.fields.status.name}^{color}
            ^*Start/End Dates:* ${timeDateObj.startDate} - ${timeDateObj.endDate}^
            ${(comUpdates.split(" ").length > 2) ? comUpdates : ""}
            ${(nextSteps.split(" ").length > 2) ? "h5. NEXT STEPS: \n" + nextSteps : ""}
            {color:gray}^_*LAST UPDATED: ${timeDateObj.updated}*_^{color}
        `;
        }
        const returnedObj = {
            // Issue Details
            key: obj.key,
            overview: overview,
            summary: summary,
            description: description,
            statusID: obj.fields.status.id,
            statusName: obj.fields.status.name,
            defDone: obj.fields.customfield_11492,
            impactedGeographicRegions: obj.fields.customfield_11644,
            labels: obj.fields.labels,
            linkedIssues: obj.fields.issuelinks,
            fixVersion: obj.fields.customfield_10600,
            reqAttention: obj.fields.customfield_11490,
            subtasks: obj.fields.subtasks,
            issueColor: obj.fields.customfield_11247,
            mvp: obj.fields.customfield_11450,
            sprint: obj.fields.customfield_10122,
            extendedJQL: obj.fields.customfield_11684,
            valueStatement: obj.fields.customfield_11540,
            projectFocus: obj.fields.customfield_11660,
            timeDateObj: timeDateObj,
            createdDate: obj.fields.created,
            targetStartDate: obj.fields.customfield_11419,
            targetEndDate: obj.fields.customfield_11420,
            startDate: obj.fields.customfield_11221, // Dates
            dueDate: obj.fields.duedate,
            endDate: obj.fields.customfield_11378,
            lastUpdated: obj.fields.updated,
            lastViewed: obj.fields.lastViewed,
            solutionDesignDocument: obj.fields.customfield_11624, // Documentation
            confluencePageID: obj.fields.customfield_11681,
            confluenceParentPageID: obj.fields.customfield_11683,
            projectWikiPage: obj.fields.customfield_11687,
            projectRoadmap: obj.fields.customfield_11686,
            progressNotes: obj.fields.customfield_11541,
            assignee: obj.fields.assignee, // People
            qaAssignees: obj.fields.customfield_11647,
            qaLead: obj.fields.customfield_11665,
            watchers: obj.fields.customfield_11202,
            stakeholders: obj.fields.customfield_11451,
            businessOwner: obj.fields.customfield_11667,
            techLead: obj.fields.customfield_11666,
            architectLead: obj.fields.customfield_11671,
            sSecurityOwner: obj.fields.customfield_11668,
            productManager: obj.fields.customfield_11669,
            communicationUpdates: obj.fields.customfield_11534, // Communication Updates
            qaUpdates: obj.fields.customfield_11651,
            nextSteps: obj.fields.customfield_11623,
            devUpdates: obj.fields.customfield_11643,
            openQnAItems: obj.fields.customfield_11485,
            additionalInfo: obj.fields.customfield_11487,
            deliveryHealth: obj.fields.customfield_11542,
            projectOverview: obj.fields.customfield_11575,
            initiativeOverview: obj.fields.customfield_11662,
            epicOverview: obj.fields.customfield_11670,
            qaEstimate: obj.fields.customfield_10501, //Estimates
            devEstimate: obj.fields.customfield_10502,
            aggregatetimeoriginalestimate: obj.fields.aggregatetimeoriginalestimate,
            estWorkComp: obj.fields.customfield_11460,
            higEst: obj.fields.customfield_11211,
            estimationNotes: obj.fields.customfield_11685,
            apiJSON: obj.fields.customfield_11642 // Tech Information
        };
        return returnedObj;
    }
    var createProjectOverview = (ov) => {
        let pov = JSON.parse(pm.collectionVariables.get("PROJECT_OVERVIEW_PAGE"));
        pov = pov + "\n" + ov;
        pm.collectionVariables.set("PROJECT_OVERVIEW_PAGE", JSON.stringify(pov));
    }
    var createInititivesOverview = (obj) => {}
    var createEpicsOverview = (obj) => {
        let summary = (obj.fields.summary !== null) ? obj.fields.summary : "No summary available.";
        let description = (obj.fields.description !== null) ? obj.fields.description : "No description available.";
        let statusID = obj.fields.status.id;
        let statusName = obj.fields.status.name;
        let overview = "h3. " + summary + "\n" + description + "\n";
        const returnedObj = {
            // Issue Details
            key: obj.key,
            overview: overview,
            summary: summary,
            description: description,
            statusID: statusID,
            statusName: statusName,
            defDone: obj.fields.customfield_11492,
            impactedGeographicRegions: obj.fields.customfield_11644,
            labels: obj.fields.labels,
            linkedIssues: obj.fields.issuelinks,
            fixVersion: obj.fields.customfield_10600,
            reqAttention: obj.fields.customfield_11490,
            subtasks: obj.fields.subtasks,
            issueColor: obj.fields.customfield_11247,
            mvp: obj.fields.customfield_11450,
            sprint: obj.fields.customfield_10122,
            extendedJQL: obj.fields.customfield_11684,
            valueStatement: obj.fields.customfield_11540,
            projectFocus: obj.fields.customfield_11660,
            startDate: obj.fields.customfield_11221, // Dates
            dueDate: obj.fields.duedate,
            endDate: obj.fields.customfield_11378,
            targetStartDate: obj.fields.customfield_11419,
            targetEndDate: obj.fields.customfield_11420,
            lastUpdated: obj.fields.updated,
            lastViewed: obj.fields.lastViewed,
            solutionDesignDocument: obj.fields.customfield_11624, // Documentation
            confluencePageID: obj.fields.customfield_11681,
            confluenceParentPageID: obj.fields.customfield_11683,
            projectWikiPage: obj.fields.customfield_11687,
            projectRoadmap: obj.fields.customfield_11686,
            progressNotes: obj.fields.customfield_11541,
            assignee: obj.fields.assignee, // People
            qaAssignees: obj.fields.customfield_11647,
            qaLead: obj.fields.customfield_11665,
            watchers: obj.fields.customfield_11202,
            stakeholders: obj.fields.customfield_11451,
            businessOwner: obj.fields.customfield_11667,
            techLead: obj.fields.customfield_11666,
            architectLead: obj.fields.customfield_11671,
            sSecurityOwner: obj.fields.customfield_11668,
            productManager: obj.fields.customfield_11669,
            communicationUpdates: obj.fields.customfield_11534, // Communication Updates
            qaUpdates: obj.fields.customfield_11651,
            nextSteps: obj.fields.customfield_11623,
            devUpdates: obj.fields.customfield_11643,
            openQnAItems: obj.fields.customfield_11485,
            additionalInfo: obj.fields.customfield_11487,
            deliveryHealth: obj.fields.customfield_11542,
            projectOverview: obj.fields.customfield_11575,
            initiativeOverview: obj.fields.customfield_11662,
            epicOverview: obj.fields.customfield_11670,
            qaEstimate: obj.fields.customfield_10501, //Estimates
            devEstimate: obj.fields.customfield_10502,
            aggregatetimeoriginalestimate: obj.fields.aggregatetimeoriginalestimate,
            estWorkComp: obj.fields.customfield_11460,
            higEst: obj.fields.customfield_11211,
            estimationNotes: obj.fields.customfield_11685,
            apiJSON: obj.fields.customfield_11642 // Tech Information

        };
        return returnedObj;
    }
    var createCommunicationUpdates = (obj) => {}
    var setIssuesObjVars = (obj, iType) => {

        let curSD = pm.collectionVariables.get(iType + "_START_LOW");
        let curED = pm.collectionVariables.get(iType + "_END_HIGH");

        curSD = moment(curSD).format("YYYY-MM-DD");
        curED = moment(curED).format("YYYY-MM-DD");
        let objSD = moment(obj[0].timeDateObj.startDate).format("YYYY-MM-DD");
        let objED = moment(obj[0].timeDateObj.dueDate).format("YYYY-MM-DD");

        curSD = (moment(objSD).isSameOrBefore(curSD)) ? objSD : curSD;
        curED = (moment(objED).isSameOrAfter(curED)) ? objED : curED;

        pm.collectionVariables.set("ACTIVE_" + iType + "_CONFLU_PG", obj[0].confluencePageID);
        pm.collectionVariables.set(iType + "_START_LOW", curSD);
        pm.collectionVariables.set(iType + "_END_HIGH", curED);
        pm.collectionVariables.set("ACTIVE_" + iType + "", obj[0].key);
        pm.collectionVariables.set("ACTIVE_" + iType + "_TARGET_START_DATE", obj[0].timeDateObj.targetStartDate);
        pm.collectionVariables.set("ACTIVE_" + iType + "_TARGET_END_DATE", obj[0].timeDateObj.targetEndDate);
        pm.collectionVariables.set("ACTIVE_" + iType + "_START_DATE", obj[0].timeDateObj.startDate);
        pm.collectionVariables.set("ACTIVE_" + iType + "_DUE_DATE", obj[0].timeDateObj.dueDate);
        pm.collectionVariables.set("ACTIVE_" + iType + "_OVERVIEW", JSON.stringify(obj[0].overview));
        pm.collectionVariables.set("ALL_" + iType + "S", JSON.stringify(obj));
        pm.collectionVariables.set("ALL_" + iType + "S_CNT", (Object.keys(obj).length));
    }
    var timeKeeper = (obj) => {
        let sprintStart = (obj.fields.customfield_10122 !== null) ? moment(obj.fields.customfield_10122[0].starDate, "YYYY-MM-DD").format("YYYY-MM-DD") : moment().add(1, 'year').format("YYYY-MM-DD");
        let created = (obj.fields.created !== "null") ? moment(obj.fields.created.substring(0, 10), "YYYY-MM-DD").format("YYYY-MM-DD") : now;
        let startDate = (obj.fields.customfield_11221 !== null) ? moment(obj.fields.customfield_11221.substring(0, 10), "YYYY-MM-DD").format("YYYY-MM-DD") : created;
        let dueDate = (obj.fields.duedate !== null) ? moment(obj.fields.duedate.substring(0, 10), "YYYY-MM-DD").format("YYYY-MM-DD") : moment().add(2, 'week').format("YYYY-MM-DD");
        let targetStartDate = (obj.fields.customfield_11419 !== null) ? moment(obj.fields.customfield_11419.substring(0, 10), "YYYY-MM-DD").format("YYYY-MM-DD") : moment().add(2, 'week').format("YYYY-MM-DD");
        let targetEndDate = (obj.fields.customfield_11420 !== null) ? moment(obj.fields.customfield_11420.substring(0, 10), "YYYY-MM-DD").format("YYYY-MM-DD") : moment().add(2, 'week').format("YYYY-MM-DD");
        let endDate = (obj.fields.customfield_11378 !== null) ? moment(obj.fields.customfield_11378.substring(0, 10), "YYYY-MM-DD").format("YYYY-MM-DD") : moment().add(2, 'week').format("YYYY-MM-DD");
        let updated = (obj.fields.updated !== "null") ? moment(obj.fields.updated.substring(0, 10), "YYYY-MM-DD").format("YYYY-MM-DD") : now;
        let lastViewed = (obj.fields.lastViewed !== "null") ? moment(obj.fields.lastViewed, "YYYY-MM-DD").format("YYYY-MM-DD") : now;
        let tdObj = {
            created: created,
            startDate: startDate,
            dueDate: dueDate,
            targetStartDate: targetStartDate,
            targetEndDate: targetEndDate,
            endDate: endDate,
            updated: updated,
            lastViewed: lastViewed
        }
        return tdObj;
    }
    return {
        myPackage: {
            createIssueObject,
            createProjectOverview,
            createInititivesOverview,
            createEpicsOverview,
            createCommunicationUpdates,
            setIssuesObjVars,
            timeKeeper
        }
    };
});