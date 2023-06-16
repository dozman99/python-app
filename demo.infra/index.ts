import * as pulumi from "@pulumi/pulumi";
import * as azure from "@pulumi/azure-native";

// resource group
const resourceGroup = new azure.resources.ResourceGroup("resourceGroup", {
    location: "eastus2", 
})

// app service plan
const appServicePlan = new azure.web.AppServicePlan("appServicePlan", {
    kind: "Linux",
    resourceGroupName: resourceGroup.name,
    location: resourceGroup.location,
    sku: {
        name: "S1",
        tier: "Standard",
    },
},
    {
        dependsOn: resourceGroup
    }
);


// app service plan
const appServicePlanStaging = new azure.web.AppServicePlan("appServicePlanStaging", {
    kind: "Linux",
    resourceGroupName: resourceGroup.name,
    location: resourceGroup.location,
    sku: {
        name: "S1",
        tier: "Standard",
    },
},
    {
        dependsOn: resourceGroup
    }
);

// webApp for the production 
const webAppProduction = new azure.web.WebApp("webAppProduction", {
    resourceGroupName: resourceGroup.name,
    location: resourceGroup.location,
    serverFarmId: appServicePlan.id,
    siteConfig: {
        alwaysOn: true
    }
},
    {
        dependsOn: appServicePlan
    }
);

// webApp for staging
const webAppStaging = new azure.web.WebApp("webAppStaging", {
    resourceGroupName: resourceGroup.name,
    location: resourceGroup.location,
    serverFarmId: appServicePlanStaging.id,
    siteConfig: {
        alwaysOn: true
    }
},
    {
        dependsOn: appServicePlanStaging
    }
);


// initial prod slot
const productionSlot = new azure.web.WebAppSlot("productionSlot", {
    name: webAppProduction.name,
    serverFarmId: appServicePlan.id,
    location: resourceGroup.location,
    resourceGroupName: resourceGroup.name,
},
    {
        dependsOn: webAppProduction
    }
);


// initial staging slot
const stagingSlot = new azure.web.WebAppSlot("stagingSlot", {
    name: webAppStaging.name,
    location: resourceGroup.location,
    serverFarmId: appServicePlanStaging.id,
    resourceGroupName: resourceGroup.name,
},
    {
        dependsOn: webAppStaging
    }
);
