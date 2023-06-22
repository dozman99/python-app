import * as pulumi from "@pulumi/pulumi";
import * as azure from "@pulumi/azure-native";


const stackName = pulumi.getStack();


// resource group
const resourceGroup = new azure.resources.ResourceGroup(`${stackName}-resourceGroup`, {
    location: "eastus2", 
})

// app service plan
const appServicePlan = new azure.web.AppServicePlan(`${stackName}-appServicePlan`, {
    kind: "Linux",
    resourceGroupName: resourceGroup.name,
    location: resourceGroup.location,
    reserved: true,
    sku: {
        name: "S1",
        tier: "Standard",
    },
},
    {
        dependsOn: resourceGroup
    }
);


// webApp
const webApp = new azure.web.WebApp(`${stackName}-webApp`, {
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


// initial slot
const productionSlot = new azure.web.WebAppSlot("initial", {
    name: webApp.name,
    serverFarmId: appServicePlan.id,
    location: resourceGroup.location,
    resourceGroupName: resourceGroup.name,
},
    {
        dependsOn: webApp
    }
);