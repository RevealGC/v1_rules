const jsonData = {
  "openapi": "3.0.0",
  "info": {
    "title": "AIES API Documentation",
    "description": "Documentation fo all the endpoints defined in this application",
    "contact": {
      "email": "patrick.lafleche@census.gov"
    },
    "license": {
      "name": "Apache 2.0",
      "url": "http://www.apache.org/licenses/LICENSE-2.0.html"
    },
    "version": "1.0.0"
  },
  "servers": [
    {
      "url": "https://aiescloud.com/",
      "description": "DEV API Server"
    },
    {
      "url": "https://aies.dev.econ.census.gov/api",
      "description": "alternate DEV API Server"
    },
    {
      "url": "https://aies.econ.census.gov/api",
      "description": "PROD API Server"
    },
    {
      "url": "https://localhost:8443/aies/backend/api",
      "description": "Developer: env('L5_SWAGGER_CONST_HOST', env('APP_URL') . '/api')"
    }
  ],
  "paths": {
    "/analytics": {
      "get": {
        "tags": [
          "NAICS"
        ],
        "summary": "Show a list of all NAICS and corresponding metrics: companies, KAU, categegories",
        "description": "Returns list of NAICS and dependencies",
        "operationId": "getAnalytics",
        "parameters": [
          {
            "name": "api_token",
            "in": "query",
            "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AnalyticsSchema"
                }
              }
            }
          },
          "400": {
            "description": "Invalid ID supplied"
          },
          "401": {
            "description": "Unauthenticated"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Resource not found"
          },
          "500": {
            "description": "Unhandled exception"
          }
        }
      }
    },
    "/companies": {
      "get": {
        "tags": [
          "Companies"
        ],
        "summary": "Get list of companies which have level type is c or company's unit type is SU",
        "description": "Example: /companies?page=1&itemsPerPage=10&sortBy[]=ent_id&sortDesc[]=false&mustSort=false&multiSort=false&filters=%7B%22login_id%22:%22200%22,%22name1%22:%22WAL%22%7D",
        "operationId": "getCompanies",
        "parameters": [
          {
            "name": "api_token",
            "in": "query",
            "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "page",
            "in": "query",
            "description": "Indicate what page.",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "integer"
            }
          },
          {
            "name": "itemsPerPage",
            "in": "query",
            "description": "Indicate how many result per page. -1 for all",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "integer"
            }
          },
          {
            "name": "sortBy[]",
            "in": "query",
            "description": "Name of property which you would like to sort on",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "sortDesc[]",
            "in": "query",
            "description": "Sorting the property in sorbBy in Desc. True/False",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "filters",
            "in": "query",
            "description": "Filters. List of Column-Value pair that help refine our search results. Currently interpreted as 'starts like' ",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string",
              "example": "{\"column_name\":\"value\",\"name\":\"WAL\"}"
            }
          },
          {
            "name": "name",
            "in": "query",
            "description": "Retrieving a list of companies which contain name value",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "levelType",
            "in": "query",
            "description": "Indicate company level type to search on. c / d / e . Remember to add 'multi' flag to be able to receive multi result",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "boolean"
            }
          },
          {
            "name": "multi",
            "in": "query",
            "description": "Indicate that you would like to receive multi company result no matter what level type it is. If you don't have this flag, it will only search company with type c",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "entId",
            "in": "query",
            "description": "Looking for one or multi company with same Ent_Id. Add 'multi' flag to get multi result.",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "filter",
            "in": "query",
            "description": "Support filtering company by its property. E.g: filter={name1:<value>}",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "naics",
            "in": "query",
            "description": "Getting all companies by a NAICS",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "category",
            "in": "query",
            "description": "Getting all companies by Category",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CompaniesSchema"
                }
              }
            }
          },
          "400": {
            "description": "Invalid ID supplied"
          },
          "401": {
            "description": "Unauthenticated"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Resource not found"
          },
          "500": {
            "description": "Unhandled exception"
          }
        }
      }
    },
    "/companies/{entId}": {
      "get": {
        "tags": [
          "Companies"
        ],
        "summary": "Show company by ent_id",
        "description": "Returns a single company detail at c level",
        "operationId": "getCompanyByEntId",
        "parameters": [
          {
            "name": "api_token",
            "in": "query",
            "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "entId",
            "in": "path",
            "description": "Return a company detail",
            "required": true,
            "style": "simple",
            "explode": false,
            "schema": {
              "type": "integer",
              "format": "int64"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CompanySchema"
                }
              }
            }
          },
          "400": {
            "description": "Invalid ID supplied"
          },
          "401": {
            "description": "Unauthenticated"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Resource not found"
          },
          "500": {
            "description": "Unhandled exception"
          }
        }
      }
    },
    "/companies/export": {
      "post": {
        "tags": [
          "Companies"
        ],
        "summary": "Exporting filtered data to an external file. Sending email with download link after done",
        "description": "Exporting filtered data to an external file. Sending email with download link after done",
        "operationId": "postExportCompanyData",
        "parameters": [
          {
            "name": "api_token",
            "in": "query",
            "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/companies_export_body"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "Successful operation"
          },
          "401": {
            "description": "Unauthenticated"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Resource not found"
          },
          "405": {
            "description": "Invalid input"
          },
          "500": {
            "description": "Unhandled exception"
          }
        }
      }
    },
    "/flagging/data-flags": {
      "get": {
        "tags": [
          "Flags"
        ],
        "summary": "Return paged list of Data Flags",
        "description": "Example: /flagging/data-flags?page=1&itemsPerPage=10&sortBy[]=description&sortDesc[]=true&mustSort=false&multiSort=false&filters=%7B%22description%22:%22Ana%22%7D",
        "operationId": "getFlaggingDataFlags",
        "parameters": [
          {
            "name": "api_token",
            "in": "query",
            "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "page",
            "in": "query",
            "description": "Indicate what page.",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "integer"
            }
          },
          {
            "name": "itemsPerPage",
            "in": "query",
            "description": "Indicate how many result per page. -1 for all",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "integer"
            }
          },
          {
            "name": "sortBy[]",
            "in": "query",
            "description": "Name of property which you would like to sort on",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "sortDesc[]",
            "in": "query",
            "description": "Sorting the property in sorbBy in Desc. True/False",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "filters",
            "in": "query",
            "description": "Filters. List of Column-Value pair that help refine our search results. Currently interpreted as 'starts like' ",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string",
              "example": "{\"column_name\":\"value\",\"name\":\"WAL\"}"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/DataFlagsSchema"
                }
              }
            }
          },
          "400": {
            "description": "Bad Request"
          },
          "401": {
            "description": "Unauthenticated"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Not found"
          },
          "500": {
            "description": "Unhandled exception"
          }
        }
      },
      "post": {
        "tags": [
          "Flags"
        ],
        "summary": "Store new Data Flag",
        "operationId": "storeFlaggingDataFlag",
        "parameters": [
          {
            "name": "api_token",
            "in": "query",
            "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/DataFlagStoreRequest"
              }
            }
          },
          "required": true
        },
        "responses": {
          "201": {
            "description": "Successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/DataFlag"
                }
              }
            }
          },
          "400": {
            "description": "Bad Request"
          },
          "401": {
            "description": "Unauthenticated"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Not found"
          },
          "500": {
            "description": "Unhandled exception"
          }
        }
      }
    },
    "/flagging/data-flags/{id}": {
      "get": {
        "tags": [
          "Flags"
        ],
        "summary": "Get Data Flag by ID",
        "operationId": "getFlaggingDataFlag",
        "parameters": [
          {
            "name": "api_token",
            "in": "query",
            "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "id",
            "in": "path",
            "description": "Data Flag ID",
            "required": true,
            "style": "simple",
            "explode": false,
            "schema": {
              "type": "integer"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/DataFlag"
                }
              }
            }
          },
          "400": {
            "description": "Bad Request"
          },
          "401": {
            "description": "Unauthenticated"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Not found"
          },
          "500": {
            "description": "Unhandled exception"
          }
        }
      },
      "put": {
        "tags": [
          "Flags"
        ],
        "summary": "Update Data Flag",
        "operationId": "updateFlaggingDataFlag",
        "parameters": [
          {
            "name": "api_token",
            "in": "query",
            "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "id",
            "in": "path",
            "description": "Data Flag ID",
            "required": true,
            "style": "simple",
            "explode": false,
            "schema": {
              "type": "integer"
            }
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/DataFlagUpdateRequest"
              }
            }
          },
          "required": true
        },
        "responses": {
          "204": {
            "description": "Successful operation"
          },
          "400": {
            "description": "Bad Request"
          },
          "401": {
            "description": "Unauthenticated"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Not found"
          },
          "500": {
            "description": "Unhandled exception"
          }
        }
      },
      "delete": {
        "tags": [
          "Flags"
        ],
        "summary": "Delete Data Flag",
        "operationId": "deleteFlaggingDataFlag",
        "parameters": [
          {
            "name": "api_token",
            "in": "query",
            "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "id",
            "in": "path",
            "description": "Data Flag ID",
            "required": true,
            "style": "simple",
            "explode": false,
            "schema": {
              "type": "integer"
            }
          }
        ],
        "responses": {
          "204": {
            "description": "Successful operation"
          },
          "400": {
            "description": "Bad Request"
          },
          "401": {
            "description": "Unauthenticated"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Not found"
          },
          "500": {
            "description": "Unhandled exception"
          }
        }
      }
    },
    "/flagging/data-version": {
      "get": {
        "tags": [
          "Flags"
        ],
        "summary": "Return paged list of Data Versions",
        "operationId": "getFlaggingDataVersions",
        "parameters": [
          {
            "name": "api_token",
            "in": "query",
            "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "page",
            "in": "query",
            "description": "Indicate what page.",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "integer"
            }
          },
          {
            "name": "itemsPerPage",
            "in": "query",
            "description": "Indicate how many result per page. -1 for all",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "integer"
            }
          },
          {
            "name": "sortBy[]",
            "in": "query",
            "description": "Name of property which you would like to sort on",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "sortDesc[]",
            "in": "query",
            "description": "Sorting the property in sorbBy in Desc. True/False",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "filters",
            "in": "query",
            "description": "Filters. List of Column-Value pair that help refine our search results. Currently interpreted as 'starts like' ",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string",
              "example": "{\"column_name\":\"value\",\"name\":\"WAL\"}"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/DataVersionsSchema"
                }
              }
            }
          },
          "400": {
            "description": "Bad Request"
          },
          "401": {
            "description": "Unauthenticated"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Not found"
          },
          "500": {
            "description": "Unhandled exception"
          }
        }
      },
      "post": {
        "tags": [
          "Flags"
        ],
        "summary": "Store new Data Version",
        "operationId": "storeFlaggingDataVersion",
        "parameters": [
          {
            "name": "api_token",
            "in": "query",
            "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/DataVersionStoreRequest"
              }
            }
          },
          "required": true
        },
        "responses": {
          "201": {
            "description": "Successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/DataVersion"
                }
              }
            }
          },
          "400": {
            "description": "Bad Request"
          },
          "401": {
            "description": "Unauthenticated"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Not found"
          },
          "500": {
            "description": "Unhandled exception"
          }
        }
      }
    },
    "/flagging/data-version/{id}": {
      "get": {
        "tags": [
          "Flags"
        ],
        "summary": "Get Data Version by ID",
        "operationId": "getFlaggingDataVersion",
        "parameters": [
          {
            "name": "api_token",
            "in": "query",
            "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "id",
            "in": "path",
            "description": "Data Version ID",
            "required": true,
            "style": "simple",
            "explode": false,
            "schema": {
              "type": "integer"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/DataVersion"
                }
              }
            }
          },
          "400": {
            "description": "Bad Request"
          },
          "401": {
            "description": "Unauthenticated"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Not found"
          },
          "500": {
            "description": "Unhandled exception"
          }
        }
      }
    },
    "/flagging/mappings": {
      "get": {
        "tags": [
          "Flags"
        ],
        "summary": "Return paged list of Mappings",
        "description": "Example: /flagging/mappings?version=2&flag=2&page=1&itemsPerPage=10&sortDesc[]=false&mustSort=false&multiSort=false&filters=%7B%7D",
        "operationId": "getFlaggingMappings",
        "parameters": [
          {
            "name": "api_token",
            "in": "query",
            "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "page",
            "in": "query",
            "description": "Indicate what page.",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "integer"
            }
          },
          {
            "name": "itemsPerPage",
            "in": "query",
            "description": "Indicate how many result per page. -1 for all",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "integer"
            }
          },
          {
            "name": "sortBy[]",
            "in": "query",
            "description": "Name of property which you would like to sort on",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "sortDesc[]",
            "in": "query",
            "description": "Sorting the property in sorbBy in Desc. True/False",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "filters",
            "in": "query",
            "description": "Filters. List of Column-Value pair that help refine our search results. Currently interpreted as 'starts like' ",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string",
              "example": "{\"column_name\":\"value\",\"name\":\"WAL\"}"
            }
          },
          {
            "name": "version",
            "in": "query",
            "description": "Version ID",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "integer"
            }
          },
          {
            "name": "flag",
            "in": "query",
            "description": "Flag ID",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "integer"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/MappingsSchema"
                }
              }
            }
          },
          "400": {
            "description": "Bad Request"
          },
          "401": {
            "description": "Unauthenticated"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Not found"
          },
          "500": {
            "description": "Unhandled exception"
          }
        }
      },
      "post": {
        "tags": [
          "Flags"
        ],
        "summary": "Store new Source Flag",
        "operationId": "storeFlaggingMapping",
        "parameters": [
          {
            "name": "api_token",
            "in": "query",
            "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/MappingStoreRequest"
              }
            }
          },
          "required": true
        },
        "responses": {
          "201": {
            "description": "Successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Mapping"
                }
              }
            }
          },
          "400": {
            "description": "Bad Request"
          },
          "401": {
            "description": "Unauthenticated"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Not found"
          },
          "500": {
            "description": "Unhandled exception"
          }
        }
      }
    },
    "/flagging/mappings/{id}": {
      "get": {
        "tags": [
          "Flags"
        ],
        "summary": "Get Mapping by ID",
        "operationId": "getFlaggingMapping",
        "parameters": [
          {
            "name": "api_token",
            "in": "query",
            "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "id",
            "in": "path",
            "description": "Mapping ID",
            "required": true,
            "style": "simple",
            "explode": false,
            "schema": {
              "type": "integer"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Mapping"
                }
              }
            }
          },
          "400": {
            "description": "Bad Request"
          },
          "401": {
            "description": "Unauthenticated"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Not found"
          },
          "500": {
            "description": "Unhandled exception"
          }
        }
      },
      "put": {
        "tags": [
          "Flags"
        ],
        "summary": "Update Source Flag",
        "operationId": "updateFlaggingMapping",
        "parameters": [
          {
            "name": "api_token",
            "in": "query",
            "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "id",
            "in": "path",
            "description": "Mapping ID",
            "required": true,
            "style": "simple",
            "explode": false,
            "schema": {
              "type": "integer"
            }
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/MappingUpdateRequest"
              }
            }
          },
          "required": true
        },
        "responses": {
          "204": {
            "description": "Successful operation"
          },
          "400": {
            "description": "Bad Request"
          },
          "401": {
            "description": "Unauthenticated"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Not found"
          },
          "500": {
            "description": "Unhandled exception"
          }
        }
      },
      "delete": {
        "tags": [
          "Flags"
        ],
        "summary": "Delete Source Flag",
        "operationId": "deleteFlaggingMapping",
        "parameters": [
          {
            "name": "api_token",
            "in": "query",
            "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "id",
            "in": "path",
            "description": "Mapping ID",
            "required": true,
            "style": "simple",
            "explode": false,
            "schema": {
              "type": "integer"
            }
          }
        ],
        "responses": {
          "204": {
            "description": "Successful operation"
          },
          "400": {
            "description": "Bad Request"
          },
          "401": {
            "description": "Unauthenticated"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Not found"
          },
          "500": {
            "description": "Unhandled exception"
          }
        }
      }
    },
    "/flagging/mappings/versions/{version}/flags/{flag}": {
      "put": {
        "tags": [
          "Flags"
        ],
        "summary": "Upsert Mapping for Source Flags relating to a Version and Data Flag",
        "description": "Example: /flagging/mappings/versions/2/flags/2",
        "operationId": "upsertFlaggingMappingSource",
        "parameters": [
          {
            "name": "api_token",
            "in": "query",
            "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "version",
            "in": "path",
            "description": "Version ID",
            "required": true,
            "style": "simple",
            "explode": false,
            "schema": {
              "type": "integer"
            }
          },
          {
            "name": "flag",
            "in": "path",
            "description": "Flag ID",
            "required": true,
            "style": "simple",
            "explode": false,
            "schema": {
              "type": "integer"
            }
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/MappingBulkUpsertRequest"
              }
            }
          },
          "required": true
        },
        "responses": {
          "204": {
            "description": "Successful operation"
          },
          "400": {
            "description": "Bad Request"
          },
          "401": {
            "description": "Unauthenticated"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Not found"
          },
          "500": {
            "description": "Unhandled exception"
          }
        }
      }
    },
    "/flagging/source-flags": {
      "get": {
        "tags": [
          "Flags"
        ],
        "summary": "Return paged list of Source Flags",
        "description": "Example: /flagging/source-flags?page=1&itemsPerPage=10&sortDesc[]=false&mustSort=false&multiSort=false&filters=%7B%22description%22:%22Annu%22%7D",
        "operationId": "getFlaggingSourceFlags",
        "parameters": [
          {
            "name": "api_token",
            "in": "query",
            "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "page",
            "in": "query",
            "description": "Indicate what page.",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "integer"
            }
          },
          {
            "name": "itemsPerPage",
            "in": "query",
            "description": "Indicate how many result per page. -1 for all",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "integer"
            }
          },
          {
            "name": "sortBy[]",
            "in": "query",
            "description": "Name of property which you would like to sort on",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "sortDesc[]",
            "in": "query",
            "description": "Sorting the property in sorbBy in Desc. True/False",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "filters",
            "in": "query",
            "description": "Filters. List of Column-Value pair that help refine our search results. Currently interpreted as 'starts like' ",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string",
              "example": "{\"column_name\":\"value\",\"name\":\"WAL\"}"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SourceFlagsSchema"
                }
              }
            }
          },
          "400": {
            "description": "Bad Request"
          },
          "401": {
            "description": "Unauthenticated"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Not found"
          },
          "500": {
            "description": "Unhandled exception"
          }
        }
      },
      "post": {
        "tags": [
          "Flags"
        ],
        "summary": "Store new Source Flag",
        "operationId": "storeFlaggingSourceFlag",
        "parameters": [
          {
            "name": "api_token",
            "in": "query",
            "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/SourceFlagStoreRequest"
              }
            }
          },
          "required": true
        },
        "responses": {
          "201": {
            "description": "Successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SourceFlag"
                }
              }
            }
          },
          "400": {
            "description": "Bad Request"
          },
          "401": {
            "description": "Unauthenticated"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Not found"
          },
          "500": {
            "description": "Unhandled exception"
          }
        }
      }
    },
    "/flagging/source-flags/{id}": {
      "get": {
        "tags": [
          "Flags"
        ],
        "summary": "Get Source Flag by ID",
        "operationId": "getFlaggingSourceFlag",
        "parameters": [
          {
            "name": "api_token",
            "in": "query",
            "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "id",
            "in": "path",
            "description": "Source Flag ID",
            "required": true,
            "style": "simple",
            "explode": false,
            "schema": {
              "type": "integer"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SourceFlag"
                }
              }
            }
          },
          "400": {
            "description": "Bad Request"
          },
          "401": {
            "description": "Unauthenticated"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Not found"
          },
          "500": {
            "description": "Unhandled exception"
          }
        }
      },
      "put": {
        "tags": [
          "Flags"
        ],
        "summary": "Update Source Flag",
        "operationId": "updateFlaggingSourceFlag",
        "parameters": [
          {
            "name": "api_token",
            "in": "query",
            "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "id",
            "in": "path",
            "description": "Source Flag ID",
            "required": true,
            "style": "simple",
            "explode": false,
            "schema": {
              "type": "integer"
            }
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/SourceFlagUpdateRequest"
              }
            }
          },
          "required": true
        },
        "responses": {
          "204": {
            "description": "Successful operation"
          },
          "400": {
            "description": "Bad Request"
          },
          "401": {
            "description": "Unauthenticated"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Not found"
          },
          "500": {
            "description": "Unhandled exception"
          }
        }
      },
      "delete": {
        "tags": [
          "Flags"
        ],
        "summary": "Delete Source Flag",
        "operationId": "deleteFlaggingSourceFlag",
        "parameters": [
          {
            "name": "api_token",
            "in": "query",
            "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "id",
            "in": "path",
            "description": "Source Flag ID",
            "required": true,
            "style": "simple",
            "explode": false,
            "schema": {
              "type": "integer"
            }
          }
        ],
        "responses": {
          "204": {
            "description": "Successful operation"
          },
          "400": {
            "description": "Bad Request"
          },
          "401": {
            "description": "Unauthenticated"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Not found"
          },
          "500": {
            "description": "Unhandled exception"
          }
        }
      }
    },
    "/logs/audit-logs": {
      "get": {
        "tags": [
          "Logs"
        ],
        "summary": "Return paged list of Audit Logs",
        "description": "Return paged list of Audit Logs",
        "operationId": "getAuditLogs",
        "parameters": [
          {
            "name": "api_token",
            "in": "query",
            "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "page",
            "in": "query",
            "description": "Indicate what page.",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "integer"
            }
          },
          {
            "name": "itemsPerPage",
            "in": "query",
            "description": "Indicate how many result per page. -1 for all",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "integer"
            }
          },
          {
            "name": "sortBy[]",
            "in": "query",
            "description": "Name of property which you would like to sort on",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "sortDesc[]",
            "in": "query",
            "description": "Sorting the property in sorbBy in Desc. True/False",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "filters",
            "in": "query",
            "description": "Filters. List of Column-Value pair that help refine our search results. Currently interpreted as 'starts like' ",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string",
              "example": "{\"column_name\":\"value\",\"name\":\"WAL\"}"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AuditLogsSchema"
                }
              }
            }
          },
          "400": {
            "description": "Bad Request"
          },
          "401": {
            "description": "Unauthenticated"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Not found"
          },
          "500": {
            "description": "Unhandled exception"
          }
        }
      }
    },
    "/logs/survey-details-archive": {
      "get": {
        "tags": [
          "Logs"
        ],
        "summary": "Return paged list of Survey Details Archive",
        "description": "Return paged list of Survey Details Archive",
        "operationId": "getSurveyDetailArchiveLog",
        "parameters": [
          {
            "name": "api_token",
            "in": "query",
            "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "page",
            "in": "query",
            "description": "Indicate what page.",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "integer"
            }
          },
          {
            "name": "itemsPerPage",
            "in": "query",
            "description": "Indicate how many result per page. -1 for all",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "integer"
            }
          },
          {
            "name": "sortBy[]",
            "in": "query",
            "description": "Name of property which you would like to sort on",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "sortDesc[]",
            "in": "query",
            "description": "Sorting the property in sorbBy in Desc. True/False",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "filters",
            "in": "query",
            "description": "Filters. List of Column-Value pair that help refine our search results. Currently interpreted as 'starts like' ",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string",
              "example": "{\"column_name\":\"value\",\"name\":\"WAL\"}"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SurveyDetailArchivesSchema"
                }
              }
            }
          },
          "400": {
            "description": "Bad Request"
          },
          "401": {
            "description": "Unauthenticated"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Not found"
          },
          "500": {
            "description": "Unhandled exception"
          }
        }
      }
    },
    "/naics/company/{entId}": {
      "get": {
        "tags": [
          "NAICS"
        ],
        "summary": "Get list of NAICS associated to a company",
        "description": "",
        "operationId": "getNaicsByCompanyEntId",
        "parameters": [
          {
            "name": "api_token",
            "in": "query",
            "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "entId",
            "in": "path",
            "description": "Company ID",
            "required": true,
            "style": "simple",
            "explode": false,
            "schema": {
              "type": "integer",
              "format": "int64"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/NaicsListSchema"
                }
              }
            }
          },
          "400": {
            "description": "Invalid ID supplied"
          },
          "401": {
            "description": "Unauthenticated"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Resource not found"
          },
          "500": {
            "description": "Unhandled exception"
          }
        }
      }
    },
    "/naics": {
      "get": {
        "tags": [
          "NAICS"
        ],
        "summary": "Get list of available NAICS ",
        "description": "",
        "operationId": "getNaics",
        "responses": {
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/NaicsListSchema"
                }
              }
            }
          },
          "400": {
            "description": "Invalid ID supplied"
          },
          "401": {
            "description": "Unauthenticated"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Resource not found"
          },
          "500": {
            "description": "Unhandled exception"
          }
        }
      }
    },
    "/response-variables": {
      "get": {
        "tags": [
          "Response Variables"
        ],
        "summary": "Return paged list of Response Variables",
        "description": "Example: /response-variables?page=1&itemsPerPage=10&sortBy[]=rv_description&sortDesc[]=false&mustSort=false&multiSort=false&filters=%7B%22rvname%22:%22RCP%22%7D",
        "operationId": "getResponseVariables",
        "parameters": [
          {
            "name": "api_token",
            "in": "query",
            "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "page",
            "in": "query",
            "description": "Indicate what page.",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "integer"
            }
          },
          {
            "name": "itemsPerPage",
            "in": "query",
            "description": "Indicate how many result per page. -1 for all",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "integer"
            }
          },
          {
            "name": "sortBy[]",
            "in": "query",
            "description": "Name of property which you would like to sort on",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "sortDesc[]",
            "in": "query",
            "description": "Sorting the property in sorbBy in Desc. True/False",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "filters",
            "in": "query",
            "description": "Filters. List of Column-Value pair that help refine our search results. Currently interpreted as 'starts like' ",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string",
              "example": "{\"column_name\":\"value\",\"name\":\"WAL\"}"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ResponseVariablesSchema"
                }
              }
            }
          },
          "400": {
            "description": "Bad Request"
          },
          "401": {
            "description": "Unauthenticated"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Not found"
          },
          "500": {
            "description": "Unhandled exception"
          }
        }
      },
      "post": {
        "tags": [
          "Response Variables"
        ],
        "summary": "Store new Response Variable",
        "description": "Returns newly created Response Variables",
        "operationId": "storeResponseVariable",
        "parameters": [
          {
            "name": "api_token",
            "in": "query",
            "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ResponseVariableStoreRequest"
              }
            }
          },
          "required": true
        },
        "responses": {
          "201": {
            "description": "Successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ResponseVariableSchema"
                }
              }
            }
          },
          "400": {
            "description": "Bad Request"
          },
          "401": {
            "description": "Unauthenticated"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Not found"
          },
          "500": {
            "description": "Unhandled exception"
          }
        }
      }
    },
    "/response-variables/{id}": {
      "get": {
        "tags": [
          "Response Variables"
        ],
        "summary": "Get Response Variable by ID",
        "description": "Return requested Response Variable",
        "operationId": "getResponseVariable",
        "parameters": [
          {
            "name": "api_token",
            "in": "query",
            "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "id",
            "in": "path",
            "description": "Response Variable ID",
            "required": true,
            "style": "simple",
            "explode": false,
            "schema": {
              "type": "integer"
            }
          }
        ],
        "responses": {
          "201": {
            "description": "Successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ResponseVariableSchema"
                }
              }
            }
          },
          "400": {
            "description": "Bad Request"
          },
          "401": {
            "description": "Unauthenticated"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Not found"
          },
          "500": {
            "description": "Unhandled exception"
          }
        }
      },
      "put": {
        "tags": [
          "Response Variables"
        ],
        "summary": "Update Response Variable",
        "description": "Update Response Variable",
        "operationId": "updateResponseVariable",
        "parameters": [
          {
            "name": "api_token",
            "in": "query",
            "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "id",
            "in": "path",
            "description": "Response Variable ID",
            "required": true,
            "style": "simple",
            "explode": false,
            "schema": {
              "type": "integer"
            }
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ResponseVariableUpdateRequest"
              }
            }
          },
          "required": true
        },
        "responses": {
          "204": {
            "description": "Successful operation"
          },
          "400": {
            "description": "Bad Request"
          },
          "401": {
            "description": "Unauthenticated"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Not found"
          },
          "500": {
            "description": "Unhandled exception"
          }
        }
      },
      "delete": {
        "tags": [
          "Response Variables"
        ],
        "summary": "Delete Response Variable",
        "description": "Delete Response Variable",
        "operationId": "delleteResponseVariable",
        "parameters": [
          {
            "name": "api_token",
            "in": "query",
            "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "id",
            "in": "path",
            "description": "Response Variable ID",
            "required": true,
            "style": "simple",
            "explode": false,
            "schema": {
              "type": "integer"
            }
          }
        ],
        "responses": {
          "204": {
            "description": "Successful operation"
          },
          "400": {
            "description": "Bad Request"
          },
          "401": {
            "description": "Unauthenticated"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Not found"
          },
          "500": {
            "description": "Unhandled exception"
          }
        }
      }
    },
    "/response-variables/company/{entId}": {
      "get": {
        "tags": [
          "Companies",
          "Response Variables"
        ],
        "summary": "Find response variables for a specific company",
        "description": "Returns response variables for a single company detail at c level",
        "operationId": "getVariablesByCompanyEntId",
        "parameters": [
          {
            "name": "api_token",
            "in": "query",
            "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "entId",
            "in": "path",
            "description": "Company ID",
            "required": true,
            "style": "simple",
            "explode": false,
            "schema": {
              "type": "integer",
              "format": "int64"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ResponseVariablesSchema"
                }
              }
            }
          },
          "400": {
            "description": "Bad Request"
          },
          "401": {
            "description": "Unauthenticated"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Not found"
          },
          "500": {
            "description": "Unhandled exception"
          }
        }
      }
    },
    "/survey-details": {
      "get": {
        "tags": [
          "Survey Details"
        ],
        "summary": "Survey Details (with Versions)",
        "description": "Example: /survey-details?page=1&itemsPerPage=25&sortBy[]=reporting_id&sortDesc[]=true&groupBy[]=reporting_id&groupDesc[]=false&mustSort=false&multiSort=false&entId=2007700339&filters=%7B%7D",
        "operationId": "surveyDetailsIndex",
        "parameters": [
          {
            "name": "api_token",
            "in": "query",
            "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "page",
            "in": "query",
            "description": "Indicate what page.",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "integer"
            }
          },
          {
            "name": "itemsPerPage",
            "in": "query",
            "description": "Indicate how many result per page. -1 for all",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "integer"
            }
          },
          {
            "name": "sortBy[]",
            "in": "query",
            "description": "Name of property which you would like to sort on",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "sortDesc[]",
            "in": "query",
            "description": "Sorting the property in sorbBy in Desc. True/False",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "filters",
            "in": "query",
            "description": "Filters. List of Column-Value pair that help refine our search results. Currently interpreted as 'starts like' ",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string",
              "example": "{\"column_name\":\"value\",\"name\":\"WAL\"}"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SurveyDetailsWithVersionsSchema"
                }
              }
            }
          },
          "400": {
            "description": "Invalid ID supplied"
          },
          "401": {
            "description": "Unauthenticated"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Resource not found"
          },
          "500": {
            "description": "Unhandled exception"
          }
        }
      }
    },
    "/survey-details/company/{entId}/total": {
      "get": {
        "tags": [
          "Survey Details"
        ],
        "summary": "Survey Details",
        "description": "Survey Details",
        "operationId": "countVariablesByCompanyEntId",
        "parameters": [
          {
            "name": "api_token",
            "in": "query",
            "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "entId",
            "in": "path",
            "description": "Company ID",
            "required": true,
            "style": "simple",
            "explode": false,
            "schema": {
              "type": "integer",
              "format": "int64"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/inline_response_200"
                }
              }
            }
          },
          "400": {
            "description": "Invalid ID supplied"
          },
          "401": {
            "description": "Unauthenticated"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Resource not found"
          },
          "500": {
            "description": "Unhandled exception"
          }
        }
      }
    },
    "/vunitlevelcounts": {
      "get": {
        "tags": [
          "Unit Levels"
        ],
        "summary": "Unit Levels",
        "description": "Unit Levels",
        "operationId": "unitLevelsIndex",
        "parameters": [
          {
            "name": "api_token",
            "in": "query",
            "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "entId",
            "in": "query",
            "description": "Company ID",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "integer",
              "format": "int64"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/VUnitLevelCountsSchema"
                }
              }
            }
          },
          "400": {
            "description": "Invalid ID supplied"
          },
          "401": {
            "description": "Unauthenticated"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Resource not found"
          },
          "500": {
            "description": "Unhandled exception"
          }
        }
      }
    },
    "/ayx/rules/list-workflows": {
      "get": {
        "tags": [
          "Rules"
        ],
        "summary": "list alteryx workflows available for a subscription",
        "description": "Rules to list alteryx workflows available for a subscription. You would get a list of all the workflows and use the id for the next subsequent API calls. The next call would provide a filter and rule_id to the survey details query. It will create a job for that rule and also populate the scratchpad database with the filtered dataset. The user would be returned the data and jobId. The jobId can be used to query the status of the job that has been submitted. Jobs have various statuses -- 1) submitted, 2) running, 3) failed, 4) success, 5) heldup, 6) waitingapproval, 7) deleted(tbd). The submitted job would be picked up by the Alteryx process to execute the rule that has been submitted to work on the data in the scratchpad.",
        "operationId": "listworkflows",
        "parameters": [
          {
            "name": "api_token",
            "in": "query",
            "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SubscriptionSchema"
                }
              }
            }
          },
          "400": {
            "description": "Invalid ID supplied"
          },
          "401": {
            "description": "Unauthenticated"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Resource not found"
          },
          "500": {
            "description": "Unhandled exception"
          }
        }
      }
    },
    "/ayx/rules/list-questions/{workflowId}": {
      "get": {
        "tags": [
          "Rules"
        ],
        "summary": "list input required to queue job for a workflow",
        "description": "Rules for input required in running an alteryx workflow job. Effectively, the input needed for a workflow to run/execute.",
        "operationId": "listquestions",
        "parameters": [
          {
            "name": "api_token",
            "in": "query",
            "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "workflowId",
            "in": "path",
            "description": "Workflow ID",
            "required": true,
            "style": "simple",
            "explode": false,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/QuestionSchema"
                }
              }
            }
          },
          "400": {
            "description": "Invalid ID supplied"
          },
          "401": {
            "description": "Unauthenticated"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Resource not found"
          },
          "500": {
            "description": "Unhandled exception"
          }
        }
      }
    },
    "/ayx/rules/queue-job/{workflowId}": {
      "post": {
        "tags": [
          "Rules"
        ],
        "summary": "Procedure to queue up a job",
        "description": "requires as input the output from /ayx/rules/list-questions",
        "operationId": "queueJob",
        "parameters": [
          {
            "name": "api_token",
            "in": "query",
            "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "workflowId",
            "in": "path",
            "description": "Workflow ID",
            "required": true,
            "style": "simple",
            "explode": false,
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/QueueJobModelSchema"
              }
            }
          },
          "required": true
        },
        "responses": {
          "201": {
            "description": "Successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/QueueJobResponse"
                }
              }
            }
          },
          "400": {
            "description": "Bad Request"
          },
          "401": {
            "description": "Unauthenticated"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Not found"
          },
          "500": {
            "description": "Unhandled exception"
          }
        }
      }
    },
    "/ayx/rules/workflow-status/{workflowId}": {
      "get": {
        "tags": [
          "Rules"
        ],
        "summary": "list all jobs and their status under the provided alteryx workflow",
        "description": "Rules to list all jobs and their status under the provided alteryx workflow",
        "operationId": "workflowstatus",
        "parameters": [
          {
            "name": "api_token",
            "in": "query",
            "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "workflowId",
            "in": "path",
            "description": "Workflow ID",
            "required": true,
            "style": "simple",
            "explode": false,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/WorkflowStatusSchema"
                }
              }
            }
          },
          "400": {
            "description": "Invalid ID supplied"
          },
          "401": {
            "description": "Unauthenticated"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Resource not found"
          },
          "500": {
            "description": "Unhandled exception"
          }
        }
      }
    },
    "/ayx/rules/job-status/{jobId}": {
      "get": {
        "tags": [
          "Rules"
        ],
        "summary": "list a job and its status",
        "description": "Rules to list a job and its status",
        "operationId": "jobstatus",
        "parameters": [
          {
            "name": "api_token",
            "in": "query",
            "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "jobId",
            "in": "path",
            "description": "Job ID",
            "required": true,
            "style": "simple",
            "explode": false,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/QueueJobResponse"
                }
              }
            }
          },
          "400": {
            "description": "Invalid ID supplied"
          },
          "401": {
            "description": "Unauthenticated"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Resource not found"
          },
          "500": {
            "description": "Unhandled exception"
          }
        }
      }
    },
    "/ayx/rules/job/{jobId}/output/{outputId}": {
      "get": {
        "tags": [
          "Rules"
        ],
        "summary": "the output of a job after it has been completed in the queue",
        "description": "Rules to retrieve the output of a job after it has been completed in the queue",
        "operationId": "joboutput",
        "parameters": [
          {
            "name": "api_token",
            "in": "query",
            "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "jobId",
            "in": "path",
            "description": "Job ID",
            "required": true,
            "style": "simple",
            "explode": false,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "outputId",
            "in": "path",
            "description": "Output ID",
            "required": true,
            "style": "simple",
            "explode": false,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/"
                }
              }
            }
          },
          "400": {
            "description": "Invalid ID supplied"
          },
          "401": {
            "description": "Unauthenticated"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Resource not found"
          },
          "500": {
            "description": "Unhandled exception"
          }
        }
      }
    },
    "/spad": {
      "get": {
        "tags": [
          "Spad"
        ],
        "summary": "",
        "description": "Example: /spad??X-API-KEY=ACCESS_TOKEN",
        "operationId": "getSpadData",
        "parameters": [
          {
            "name": "api_token",
            "in": "query",
            "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
            "required": true,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "id",
            "in": "query",
            "description": "spad id",
            "required": false,
            "schema": {
              "type": "integer"
            }
          },
          {
            "name": "reporting_id",
            "in": "query",
            "description": "",
            "required": false,
            "schema": {
              "type": "integer"
            }
          },
          {
            "name": "parent_id",
            "in": "query",
            "description": "",
            "required": false,
            "default" : 0,
            "schema": {
              "type": "integer"
            }
          },
          {
            "name": "conditionstring",
            "in": "query",
            "description": "",
            "required": false,
            "schema": {
              "type": "string"
            }
          },        
          {
              "name": "page",
              "in": "query",
              "description": "",
              "required": false,
              "schema": {
                "type": "integer"
              }
          },
          {
              "name": "itemsPerPage",
              "in": "query",
              "description": "",
              "required": false,
              "default" : 100,
              "schema": {
                "type": "integer"
              }
          },
          {
              "name": "sortBy",
              "in": "query",
              "description": "",
              "required": false,
              "schema": {
                "type": "string"
              }
          },
          {
              "name": "sortDesc",
              "in": "query",
              "description": "",
              "required": false,
              "schema": {
                "type": "string"
              }
          },
          {
              "name": "filters",
              "in": "query",
              "description": "",
              "required": false,
              "style": "form",
              "explode": true,
              "schema": {
                "type": "string"
              }
          },
        ],
        "responses": {
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object"
                }
              }
            }
          },
          "400": {
            "description": "Invalid ID supplied"
          },
          "401": {
            "description": "Unauthenticated"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Resource not found"
          },
          "500": {
            "description": "Unhandled exception"
          }
        }
      },
      "delete": {
        "tags": [
          "Spad"
        ],
        "summary": "Delete Spad Data",
        "operationId": "deleteSpadData",
        "parameters": [
          {
            "name": "api_token",
            "in": "query",
            "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
            "required": true,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful operation"
          },
          "400": {
            "description": "Bad Request"
          },
          "401": {
            "description": "Unauthenticated"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Not found"
          },
          "500": {
            "description": "Unhandled exception"
          }
        }
      }
    },
    "/spad/{id}": {
      "get": {
        "tags": [
          "Spad"
        ],
        "summary": "",
        "description": "Example: /spad??X-API-KEY=ACCESS_TOKEN",
        "operationId": "getSpadDataForId",
        "parameters": [
          {
            "name": "api_token",
            "in": "query",
            "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
            "required": true,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object"
                }
              }
            }
          },
          "400": {
            "description": "Invalid ID supplied"
          },
          "401": {
            "description": "Unauthenticated"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Resource not found"
          },
          "500": {
            "description": "Unhandled exception"
          }
        }
      },
      "delete": {
        "tags": [
          "Spad"
        ],
        "summary": "Delete Spad Data",
        "operationId": "deleteSpadDataForId",
        "parameters": [
          {
            "name": "api_token",
            "in": "query",
            "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
            "required": true,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "id",
            "in": "path",
            "description": "Spad ID",
            "required": true,
            "style": "simple",
            "explode": false,
            "schema": {
              "type": "integer"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful operation"
          },
          "400": {
            "description": "Bad Request"
          },
          "401": {
            "description": "Unauthenticated"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Not found"
          },
          "500": {
            "description": "Unhandled exception"
          }
        }
      }
    },
    "/spad/merge/{id}": {
      "get": {
        "tags": [
          "Spad"
        ],
        "summary": " merges spad data for given job id",
        "description": "Example: /spad/merge/123456??X-API-KEY=ACCESS_TOKEN",
        "operationId": "mergeSpadDataForJobId",
        "parameters": [
          {
            "name": "api_token",
            "in": "query",
            "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
            "required": true,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
              "name": "id",
              "in": "path",
              "description": "job id",
              "required": true,
              "style": "simple",
              "explode": false,
              "schema": {
                "type": "integer",
                "format": "int64"
              }
          },
         ],
        "responses": {
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object"
                }
              }
            }
          },
          "400": {
            "description": "Invalid ID supplied"
          },
          "401": {
            "description": "Unauthenticated"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Resource not found"
          },
          "500": {
            "description": "Unhandled exception"
          }
        }
      }
    },
    "/spad/testrule": {
      "post": {
        "tags": [
          "Spad"
        ],
        "summary": "",
        "description": "Example: /spad/testrule??X-API-KEY=ACCESS_TOKEN",
        "operationId": "spadTestRule",
        "parameters": [
          {
            "name": "api_token",
            "in": "query",
            "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          }
        ],          
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/RulesConditionValidationRequest"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object"
                }
              }
            }
          },
          "401": {
            "description": "Unauthenticated"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Resource not found"
          },
          "500": {
            "description": "Unhandled exception"
          }
        }
      }
    },
    "/api/appliances/jobs/{id}/merge": {
      "get": {
        "tags": [
          "Spad"
        ],
        "summary": " merges spad data for given job id",
        "description": "ACCESS_TOKEN",
        "operationId": "mergeSpadDataByJobId",
        "parameters": [
          {
            "name": "api_token",
            "in": "query",
            "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
            "required": true,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
              "name": "id",
              "in": "path",
              "description": "job id",
              "required": true,
              "style": "simple",
              "explode": false,
              "schema": {
                "type": "integer",
                "format": "int64"
              }
          },
         ],
        "responses": {
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object"
                }
              }
            }
          },
          "400": {
            "description": "Invalid ID supplied"
          },
          "401": {
            "description": "Unauthenticated"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Resource not found"
          },
          "500": {
            "description": "Unhandled exception"
          }
        }
      }
    },
    "/spad/aggregate/{id}": {
      "get": {
        "tags": [
          "Spad"
        ],
        "summary": "",
        "description": "ACCESS_TOKEN",
        "operationId": "aggregateFacts",
        "parameters": [
          {
            "name": "api_token",
            "in": "query",
            "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
            "required": true,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "id",
            "in": "path",
            "description": "Spad id to aggragate",
            "required": true,
            "schema": {
              "type": "integer"
            }
          },
        ],
        "responses": {
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object"
                }
              }
            }
          },
          "400": {
            "description": "Invalid ID supplied"
          },
          "401": {
            "description": "Unauthenticated"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Resource not found"
          },
          "500": {
            "description": "Unhandled exception"
          }
        }
      }
    },
    "/reporting_unit/{reporting_id)/validate": {
      "get": {
        "tags": [
          "ReportingUnit"
        ],
        "summary": "",
        "description": "Example: /reporting_unit/123456/validate??X-API-KEY=ACCESS_TOKEN",
        "operationId": "validateReportingId",
        "parameters": [
          {
            "name": "api_token",
            "in": "query",
            "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "reporting_id",
            "in": "path",
            "required": true,
            "style": "simple",
            "explode": false,
            "schema": {
              "type": "integer"
            }
          },
          {
              "name": "attended",
              "in": "query",
              "required": false,
              "schema": {
                  "type": "string",
                  "example" : false
              }
          },
          {
          "name": "query",
          "in": "path",
          "required": false,
          "schema": {
              "type": "integer"
          }
          }
        ],
        "responses": {
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object"
                }
              }
            }
          },
          "400": {
            "description": "Invalid ID supplied"
          },
          "401": {
            "description": "Unauthenticated"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Resource not found"
          },
          "500": {
            "description": "Unhandled exception"
          }
        }
      },
      "put": {
          "tags": [
            "ReportingUnit"
          ],
          "summary": "",
          "description": "Example: /reporting_unit/123456/validate??X-API-KEY=ACCESS_TOKEN",
          "operationId": "validateReportingId",
          "parameters": [
            {
              "name": "api_token",
              "in": "query",
              "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
              "required": false,
              "style": "form",
              "explode": true,
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "reporting_id",
              "in": "path",
              "required": true,
              "style": "simple",
              "explode": false,
              "schema": {
                "type": "integer"
              }
            },
            {
                "name": "data",
                "in": "body",
                "required": true,
                "schema": {
                  "type": "string",
                  "example": "{\"rvs\":[{\"RCPT_TOT\": -1, \"JACK\":34}]}"
                }
              },
              {
                "name": "attended",
                "in": "query",
                "required": false,
                "schema": {
                  "type": "string"
                }
              },
              {
                "name": "parent_id",
                "in": "query",
                "required": false,
                "schema": {
                  "type": "integer"
                }
              }
          ],
          "responses": {
            "200": {
              "description": "successful operation",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object"
                  }
                }
              }
            },
            "400": {
              "description": "Invalid ID supplied"
            },
            "401": {
              "description": "Unauthenticated"
            },
            "403": {
              "description": "Forbidden"
            },
            "404": {
              "description": "Resource not found"
            },
            "500": {
              "description": "Unhandled exception"
            }
          }
      }
  
    },
    "/reporting_unit/{reporting_id)/update": {
      "put": {
          "tags": [
            "ReportingUnit"
          ],
          "summary": "Validates and saves",
          "description": "Example: /reporting_unit/123456/validate??X-API-KEY=ACCESS_TOKEN",
          "operationId": "validateReportingId",
          "parameters": [
            {
              "name": "api_token",
              "in": "query",
              "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
              "required": false,
              "style": "form",
              "explode": true,
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "reporting_id",
              "in": "path",
              "required": true,
              "style": "simple",
              "explode": false,
              "schema": {
                "type": "integer"
              }
            },
            {
                "name": "data",
                "in": "body",
                "required": true,
                "schema": {
                  "type": "string",
                  "example": "{\"rvs\":[{\"RCPT_TOT\": -1, \"JACK\":34}]}"
                }
              },
              {
                "name": "attended",
                "in": "query",
                "required": false,
                "schema": {
                  "type": "boolean",
                  "example" : false
                }
              },
              {
                "name": "parent_id",
                "in": "query",
                "required": false,
                "schema": {
                  "type": "integer"
                }
              }
          ],
          "responses": {
            "200": {
              "description": "successful operation",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object"
                  }
                }
              }
            },
            "400": {
              "description": "Invalid ID supplied"
            },
            "401": {
              "description": "Unauthenticated"
            },
            "403": {
              "description": "Forbidden"
            },
            "404": {
              "description": "Resource not found"
            },
            "500": {
              "description": "Unhandled exception"
            }
          }
      }
    },
    "/rulesrepo/testcondition": {
      "post": {
        "tags": [
          "RulesRepository"
        ],
        "summary": "tests condition string for validity",
        "description": "Tests condition passed via facts in request body for validity of syntax",
        "operationId": "postRulesRepositoryTestCondition",
        "parameters": [
          {
            "name": "api_token",
            "in": "query",
            "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          }
        ],
      "requestBody": {
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/RulesConditionValidationRequest"
            }
          }
        },
        "required": true
      },
      "responses": {
        "200": {
          "description": "successful operation",
          "content": {
            "application/json": {
              "schema": {
                "type": "object"
              }
            }
          }
        },
        "401": {
          "description": "Unauthenticated"
        },
        "403": {
          "description": "Forbidden"
        },
        "404": {
          "description": "Resource not found"
        },
        "500": {
          "description": "Unhandled exception"
        }
      }
    },
    },
    "/rulesrepo/factsandrules/{id}": {
      "get": {
        "tags": [
          "RulesRepository"
        ],
        "summary": "Get RulesRepository Facts and Rules for given reposrting id",
        "description": "Example: /rulesrepo/factsandrules/34??X-API-KEY=ACCESS_TOKEN",
        "operationId": "getRulesRepositoryFactsAndRules",
        "parameters": [
          {
            "name": "api_token",
            "in": "query",
            "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
            "required": true,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "id",
            "in": "path",
            "description": "reporting Id",
            "required": true,
            "schema": {
              "type": "integer"
            }
          },
        ],
        "responses": {
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object"
                }
              }
            }
          },
          "400": {
            "description": "Invalid ID supplied"
          },
          "401": {
            "description": "Unauthenticated"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Resource not found"
          },
          "500": {
            "description": "Unhandled exception"
          }
        }
      }
    },
    "/rulesrepo/compile/{id}": {
      "put": {
        "tags": [
          "RulesRepository"
        ],
        "summary": "Compiles Rule from RulesRepository for given rule id",
        "description": "Example: /rulesrepo/compile/34??X-API-KEY=ACCESS_TOKEN",
        "operationId": "putRulesRepositoryCompileRules",
        "parameters": [
          {
            "name": "api_token",
            "in": "query",
            "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "id",
            "in": "path",
            "description": "Rule Id",
            "required": true,
            "schema": {
              "type": "integer"
            }
          },
          {
              "name": "X-API-KEY",
              "in": "header",
              "description": "X-API-KEY",
              "required": true,
              "schema": {
                  "type": "string"
              }
          },
          {
              "name": "X-JBID",
              "in": "header",
              "description": "X-JBID",
              "required": true,
              "schema": {
                  "type": "string"
              }
          }
        ],
        "responses": {
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object"
                }
              }
            }
          },
          "400": {
            "description": "Invalid ID supplied"
          },
          "401": {
            "description": "Unauthenticated"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Resource not found"
          },
          "500": {
            "description": "Unhandled exception"
          }
        }
      }
    },
    "/rulesrepo": {
      "get": {
        "tags": [
          "RulesRepository"
        ],
        "summary": "Get Rules",
        "description": "Example: /rules??X-API-KEY=ACCESS_TOKEN",
        "operationId": "getRulesRepository",
        "parameters": [
          {
            "name": "api_token",
            "in": "query",
            "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
              "name": "X-API-KEY",
              "in": "header",
              "description": "X-API-KEY",
              "required": true,
              "schema": {
                  "type": "string"
              }
          },
          {
              "name": "page",
              "in": "query",
              "required": false,
              "schema": {
                "type": "integer"
              }
          },
          {
              "name": "filters",
              "in": "query",
              "required": false,
              "schema": {
                "type": "string"
              }
          },
          {
              "name": "format",
              "in": "query",
              "required": false,
              "schema": {
                "type": "string"
              }
          }
        ],
        "responses": {
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object"
                }
              }
            }
          },
          "400": {
            "description": "Invalid ID supplied"
          },
          "401": {
            "description": "Unauthenticated"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Resource not found"
          },
          "500": {
            "description": "Unhandled exception"
          }
        }
      },
      "post": {
          "tags": [
            "RulesRepository"
          ],
          "summary": "Post Rules",
          "description": "Example: /rules??X-API-KEY=ACCESS_TOKEN",
          "operationId": "postRulesRepository",
          "parameters": [
          {
          "name": "api_token",
          "in": "query",
          "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
          "required": false,
          "style": "form",
          "explode": true,
          "schema": {
              "type": "string"
          }
          },
          {
              "name": "X-API-KEY",
              "in": "header",
              "description": "X-API-KEY",
              "required": true,
              "schema": {
                  "type": "string"
              }
          },
          {
          "name": "X-JBID",
          "in": "header",
          "description": "X-API-KEY",
          "required": true,
          "schema": {
              "type": "string"
          }
      },
      {
          "name": "type",
          "in": "query",
          "required": true,
          "schema": {
          "type": "string"
          }
      },
      {
          "name": "data",
          "in": "body",
          "required": true,
          "schema": {
          "type": "string"
          }
      },
      {
          "name": "name",
          "in": "body",
          "required": true,
          "schema": {
          "type": "string"
          }
      },
          {
          "name": "active",
          "in": "body",
          "required": false,
          "schema": {
              "type": "boolean",
              "example":false
          }
      },
      {
          "name": "share_flag",
          "in": "query",
          "required": false,
          "schema": {
              "type": "string"
          }
      },
      {
          "name": "description",
          "in": "query",
          "required": false,
          "default": "Rule",
          "schema": {
              "type": "string"
          }
      },
      {
          "name": "rvs",
          "in": "query",
          "required": true,
          "schema": {
              "type": "string"
          }
      }
      ],
      "responses": {
          "200": {
          "description": "successful operation",
          "content": {
              "application/json": {
              "schema": {
                  "type": "object"
              }
              }
          }
          },
          "401": {
          "description": "Unauthenticated"
          },
          "403": {
          "description": "Forbidden"
          },
          "404": {
          "description": "Resource not found"
          },
          "500": {
          "description": "Unhandled exception"
          }
      }
      }
    },
    "/rulesrepo/save/parsedrule/{id}": {
      "put": {
        "tags": [
          "RulesRepository"
        ],
        "summary": "Saves parsed rule for the given id",
        "description": "Example: /rulesrepo/save/parsedrule/34??X-API-KEY=ACCESS_TOKEN",
        "operationId": "putRulesRepositorySaveParsedRule",
        "parameters": [
          {
            "name": "api_token",
            "in": "query",
            "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "id",
            "in": "path",
            "description": "Rule Id",
            "required": true,
            "schema": {
              "type": "integer"
            }
          },
          {
              "name": "X-API-KEY",
              "in": "header",
              "description": "X-API-KEY",
              "required": true,
              "schema": {
                  "type": "string"
              }
          },
          {
              "name": "X-JBID",
              "in": "header",
              "description": "X-JBID",
              "required": true,
              "schema": {
                  "type": "string"
              }
          }
        ],
        "responses": {
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object"
                }
              }
            }
          },
          "400": {
            "description": "Invalid ID supplied"
          },
          "401": {
            "description": "Unauthenticated"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Resource not found"
          },
          "500": {
            "description": "Unhandled exception"
          }
        }
      }
    },
    "/rulesrepo/{id}": {
      "put": {
        "tags": [
          "RulesRepository"
        ],
        "summary": "",
        "description": "Example: /rulesrepo/34??X-API-KEY=ACCESS_TOKEN",
        "operationId": "putRulesRepository",
        "parameters": [
          {
            "name": "api_token",
            "in": "query",
            "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "id",
            "in": "path",
            "description": "Rule Id",
            "required": true,
            "schema": {
              "type": "integer"
            }
          },
          {
              "name": "X-API-KEY",
              "in": "header",
              "description": "X-API-KEY",
              "required": true,
              "schema": {
                  "type": "string"
              }
          },
          {
              "name": "X-JBID",
              "in": "header",
              "description": "X-JBID",
              "required": true,
              "schema": {
                  "type": "string"
              }
          }
        ],
        "responses": {
          "200": {
            "description": "successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object"
                }
              }
            }
          },
          "400": {
            "description": "Invalid ID supplied"
          },
          "401": {
            "description": "Unauthenticated"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Resource not found"
          },
          "500": {
            "description": "Unhandled exception"
          }
        }
      }
    },
    "/ayx/submitWorkFlow": {
      "post": {
        "tags": [
          "AyxWorkflow"
        ],
        "summary": "Submit Ayx Workflow",
        "description": "Example: /ayx/submitWorkFlow??X-API-KEY=ACCESS_TOKEN",
        "operationId": "ayxSubmitWorkflow",
        "parameters": [
        {
        "name": "api_token",
        "in": "query",
        "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
        "required": false,
        "style": "form",
        "explode": true,
        "schema": {
            "type": "string"
        }
        },
        {
            "name": "X-API-KEY",
            "in": "header",
            "description": "X-API-KEY",
            "required": true,
            "schema": {
                "type": "string"
            }
        },
        {
        "name": "X-JBID",     
        "in": "header",
        "description": "X-API-KEY",
        "required": true,
        "schema": {
            "type": "string"
        }
        },
        {
          "name": "filters",
          "in": "body",
          "required": false,
          "schema": {
            "type": "string"
          }
        },
        {
          "name": "type",
          "in": "body",
          "required": false,
          "schema": {
            "type": "string"
          }
        },
        {
          "name": "args",
          "in": "body",
          "required": false,
          "schema": {
            "type": "string"
          }
        },
        {
          "name": "sql_from_frontend",
          "in": "body",
          "required": false,
          "schema": {
            "type": "string"
          }
        },
        {
          "name": "workFlowId",
          "in": "query",
          "required": true,
          "schema": {
            "type": "string"
          }
        },
        {
          "name": "output",
          "in": "query",
          "required": true,
          "schema": {
            "type": "string"
          }
        }  
      ],
      "responses": {
          "200": {
          "description": "successful operation",
          "content": {
              "application/json": {
              "schema": {
                  "type": "object"
              }
              }
          }
          },
          "401": {
          "description": "Unauthenticated"
          },
          "403": {
          "description": "Forbidden"
          },
          "404": {
          "description": "Resource not found"
          },
          "500": {
          "description": "Unhandled exception"
          }
      }
      }
    },
    "/ayx/jobs/":{
      "get": {
        "tags": [
          "AyxJobs"
        ],
        "summary": "Get All Jobs",
        "description": "Example: /ayx/jobs??X-API-KEY=ACCESS_TOKEN",
        "operationId": "ayxGetJobs",
        "parameters": [
        {
        "name": "api_token",
        "in": "query",
        "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
        "required": true,
        "style": "form",
        "explode": true,
        "schema": {
            "type": "string"
          }
        },
        {
          "name": "id",
          "in": "query",
          "required": false,
          "schema": {
            "type": "integer"
          }
        },
        {
          "name": "page",
          "in": "query",
          "required": false,
          "schema": {
            "type": "integer"
          }
        },
        {
          "name": "itemsPerPage",
          "in": "query",
          "required": false,
          "schema": {
            "type": "integer"
          }
        },
        {
          "name": "sortBy",
          "in": "query",
          "required": false,
          "schema": {
            "type": "string"
          }
        },
        {
          "name": "sortDesc",
          "in": "query",
          "required": false,
          "schema": {
            "type": "string"
          }
        },
        {
          "name": "filters",
          "in": "body",
          "required": false,
          "schema": {
            "type": "string"
          }
        }  
      ],
      "responses": {
          "200": {
          "description": "successful operation",
          "content": {
              "application/json": {
              "schema": {
                  "type": "object"
                }
              }
          }
          },
          "401": {
          "description": "Unauthenticated"
          },
          "403": {
          "description": "Forbidden"
          },
          "404": {
          "description": "Resource not found"
          },
          "500": {
          "description": "Unhandled exception"
          }
      }
      }
    },
    "/ayx/jobs/{id}":{
      "get": {
        "tags": [
          "AyxJobs"
        ],
        "summary": "Get Jobs for the given id",
        "description": "Example: /ayx/jobs/34??X-API-KEY=ACCESS_TOKEN",
        "operationId": "ayxGetJob",
        "parameters": [
        {
        "name": "api_token",
        "in": "query",
        "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
        "required": true,
        "style": "form",
        "explode": true,
        "schema": {
            "type": "string"
          }
        },
        {
          "name": "id",
          "in": "query",
          "required": true,
          "schema": {
            "type": "integer"
          }
        },
      ],
      "responses": {
          "200": {
          "description": "successful operation",
          "content": {
              "application/json": {
              "schema": {
                  "type": "object"
                }
              }
          }
          },
          "400": {
            "description": "Invalid ID supplied"
          },
          "401": {
          "description": "Unauthenticated"
          },
          "403": {
          "description": "Forbidden"
          },
          "404": {
          "description": "Resource not found"
          },
          "500": {
          "description": "Unhandled exception"
          }
      }
      }, 
    }
  },
  "components": {
    "schemas": {
      "DataFlagStoreRequest": {
        "title": "Flagging Data Flag Store Request",
        "required": [
          "code"
        ],
        "type": "object",
        "properties": {
          "code": {
            "type": "string",
            "example": "A"
          },
          "description": {
            "type": "string",
            "example": "Data received from Respondent "
          }
        }
      },
      "DataFlagUpdateRequest": {
        "title": "Flagging Data Flag Update Request",
        "required": [
          "code"
        ],
        "type": "object",
        "properties": {
          "code": {
            "type": "string",
            "example": "A"
          },
          "description": {
            "type": "string",
            "example": "Data received from Respondent "
          }
        }
      },
      "DataVersionStoreRequest": {
        "title": "Flagging Data Version Store Request",
        "required": [
          "code"
        ],
        "type": "object",
        "properties": {
          "code": {
            "type": "string",
            "example": "OR"
          },
          "description": {
            "type": "string",
            "example": "Original Reported Value"
          }
        }
      },
      "DataVersionUpdateRequest": {
        "title": "Flagging Data Version Update Request",
        "required": [
          "code"
        ],
        "type": "object",
        "properties": {
          "code": {
            "type": "string",
            "example": "OR"
          },
          "description": {
            "type": "string",
            "example": "Original Reported Value"
          }
        }
      },
      "MappingBulkUpsertRequest": {
        "title": "Flagging Mapping Store Request",
        "required": [
          "source_flags"
        ],
        "type": "object",
        "properties": {
          "source_flags": {
            "type": "array",
            "example": "[1,2,3]",
            "items": {
              "$ref": "#/components/schemas/MappingBulkUpsertRequest_source_flags"
            }
          }
        }
      },
      "MappingStoreRequest": {
        "title": "Flagging Mapping Store Request",
        "required": [
          "flagging_data_flag_id",
          "flagging_data_version_id",
          "flagging_source_flag_id"
        ],
        "type": "object",
        "properties": {
          "flagging_data_version_id": {
            "type": "integer",
            "example": 1
          },
          "flagging_data_flag_id": {
            "type": "integer",
            "example": 1
          },
          "source_flag_id": {
            "type": "integer",
            "example": 1
          }
        }
      },
      "MappingUpdateRequest": {
        "title": "Flagging Mapping Store Request",
        "required": [
          "flagging_data_flag_id",
          "flagging_data_version_id",
          "flagging_source_flag_id"
        ],
        "type": "object",
        "properties": {
          "flagging_data_version_id": {
            "type": "integer",
            "example": 1
          },
          "flagging_data_flag_id": {
            "type": "integer",
            "example": 1
          },
          "source_flag_id": {
            "type": "integer",
            "example": 1
          }
        }
      },
      "SourceFlagStoreRequest": {
        "title": "Flagging Source Flag Store Request",
        "required": [
          "code"
        ],
        "type": "object",
        "properties": {
          "code": {
            "type": "string",
            "example": "A"
          },
          "description": {
            "type": "string",
            "example": "Data received from Respondent "
          }
        }
      },
      "SourceFlagUpdateRequest": {
        "title": "Flagging Source Flag Update Request",
        "required": [
          "code"
        ],
        "type": "object",
        "properties": {
          "code": {
            "type": "string",
            "example": "A"
          },
          "description": {
            "type": "string",
            "example": "Data received from Respondent "
          }
        }
      },
      "ResponseVariableStoreRequest": {
        "title": "Response Variable Request",
        "required": [
          "rvname"
        ],
        "type": "object",
        "properties": {
          "rvname": {
            "type": "string",
            "example": "RCPT_TOT"
          },
          "rv_description": {
            "type": "string",
            "example": "Total Sales, Shipments, Receipts or Revenue"
          },
          "mu_flag": {
            "type": "string",
            "description": "Can be either YES or NO",
            "example": "YES"
          },
          "kau_flag": {
            "type": "string",
            "description": "Can be either YES or NO",
            "example": "NO"
          },
          "estab_flag": {
            "type": "string",
            "description": "Can be either YES or NO",
            "example": "YES"
          },
          "qdm_flag": {
            "type": "string",
            "description": "Can be either YES or NO",
            "example": "NO"
          }
        }
      },
      "ResponseVariableUpdateRequest": {
        "title": "Response Variable Request",
        "required": [
          "rvname"
        ],
        "type": "object",
        "properties": {
          "rvname": {
            "type": "string",
            "example": "RCPT_TOT"
          },
          "rv_description": {
            "type": "string",
            "example": "Total Sales, Shipments, Receipts or Revenue"
          },
          "mu_flag": {
            "type": "string",
            "description": "Can be either YES or NO",
            "example": "YES"
          },
          "kau_flag": {
            "type": "string",
            "description": "Can be either YES or NO",
            "example": "NO"
          },
          "estab_flag": {
            "type": "string",
            "description": "Can be either YES or NO",
            "example": "YES"
          },
          "qdm_flag": {
            "type": "string",
            "description": "Can be either YES or NO",
            "example": "NO"
          }
        }
      },
      "DataFlag": {
        "title": "Data Flag",
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "example": 1
          },
          "code": {
            "type": "string",
            "example": "A"
          },
          "description": {
            "type": "string",
            "example": "Annual Report; 10K; 10Q"
          },
          "created_at": {
            "type": "string",
            "format": "date-time"
          },
          "created_by": {
            "type": "string",
            "example": "jbondid001"
          },
          "updated_by": {
            "type": "string",
            "example": "jbondid001"
          },
          "updated_at": {
            "type": "string",
            "format": "date-time"
          },
          "deleted_by": {
            "type": "string",
            "example": "jbondid001"
          },
          "deleted_at": {
            "type": "string",
            "format": "date-time"
          }
        }
      },
      "DataVersion": {
        "title": "Version Flag",
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "example": 1
          },
          "code": {
            "type": "string",
            "example": "A"
          },
          "description": {
            "type": "string",
            "example": "Annual Report; 10K; 10Q"
          },
          "created_at": {
            "type": "string",
            "format": "date-time"
          },
          "created_by": {
            "type": "string",
            "example": "jbondid001"
          },
          "updated_by": {
            "type": "string",
            "example": "jbondid001"
          },
          "updated_at": {
            "type": "string",
            "format": "date-time"
          },
          "deleted_by": {
            "type": "string",
            "example": "jbondid001"
          },
          "deleted_at": {
            "type": "string",
            "format": "date-time"
          }
        }
      },
      "Mapping": {
        "title": "Flag Mapping",
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "example": 1
          },
          "flagging_data_version_id": {
            "type": "integer",
            "example": 1
          },
          "flagging_data_flag_id": {
            "type": "integer",
            "example": 2
          },
          "source_flag_id": {
            "type": "integer",
            "example": 3
          },
          "created_at": {
            "type": "string",
            "format": "date-time"
          },
          "created_by": {
            "type": "string",
            "example": "jbondid001"
          },
          "updated_by": {
            "type": "string",
            "example": "jbondid001"
          },
          "updated_at": {
            "type": "string",
            "format": "date-time"
          },
          "deleted_by": {
            "type": "string",
            "example": "jbondid001"
          },
          "deleted_at": {
            "type": "string",
            "format": "date-time"
          }
        }
      },
      "SourceFlag": {
        "title": "Source Flag",
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "example": 1
          },
          "code": {
            "type": "string",
            "example": "A"
          },
          "description": {
            "type": "string",
            "example": "Annual Report; 10K; 10Q"
          },
          "created_at": {
            "type": "string",
            "format": "date-time"
          },
          "created_by": {
            "type": "string",
            "example": "jbondid001"
          },
          "updated_by": {
            "type": "string",
            "example": "jbondid001"
          },
          "updated_at": {
            "type": "string",
            "format": "date-time"
          },
          "deleted_by": {
            "type": "string",
            "example": "jbondid001"
          },
          "deleted_at": {
            "type": "string",
            "format": "date-time"
          }
        }
      },
      "AnalyticSchema": {
        "title": "Analytic",
        "type": "object",
        "properties": {
          "categories": {
            "type": "string"
          },
          "companies": {
            "type": "integer",
            "example": 2
          },
          "establishments": {
            "type": "integer",
            "example": 11
          },
          "frame_rate_pct": {
            "type": "number",
            "format": "double",
            "example": 0.05
          },
          "kaus": {
            "type": "integer",
            "example": 6
          },
          "naics_code": {
            "type": "string",
            "example": "327910"
          },
          "naics_title": {
            "type": "string",
            "example": "Abrasive Product Manufacturing"
          },
          "response_rate_pct": {
            "type": "integer",
            "example": 1
          }
        },
        "description": "Analytic"
      },
      "    ": {
        "title": "Analytics",
        "type": "object",
        "properties": {
          "data": {
            "title": "Data",
            "type": "array",
            "description": "Data wrapper",
            "items": {
              "$ref": "#/components/schemas/AnalyticSchema"
            }
          }
        },
        "description": "Analytics",
        "xml": {
          "name": "AnalyticsSchema"
        }
      },
      "AuditLogSchema": {
        "title": "Audit Log",
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "example": 1
          },
          "user_type": {
            "type": "string",
            "example": "Census\\Aas\\Models\\User"
          },
          "user_id": {
            "type": "string",
            "example": "jbidd001"
          },
          "event": {
            "type": "string",
            "description": "created|updated|deleted",
            "example": "created"
          },
          "auditable_type": {
            "type": "string",
            "example": "App\\Models\\ResponseVariable"
          },
          "auditable_id": {
            "type": "integer",
            "example": 1
          },
          "old_values": {
            "type": "string",
            "example": "{'rvname':'RVNAME-OLD'}"
          },
          "new_values": {
            "type": "string",
            "example": "{'rvname':'RVNAME-NEW'}"
          },
          "url": {
            "type": "string",
            "example": "https://aies.dev.econ,census.gov/api/response-variables"
          },
          "ip_address": {
            "type": "string",
            "example": "127.0.0.1"
          },
          "user_agent": {
            "type": "string",
            "example": "PostmanRuntime/7.24.1"
          },
          "tabs": {
            "type": "string",
            "example": "TAG1"
          },
          "created_at": {
            "type": "string",
            "format": "date-time"
          },
          "updated_at": {
            "type": "string",
            "format": "date-time"
          }
        }
      },
      "AuditLogsSchema": {
        "title": "Audit Logs",
        "allOf": [
          {
            "$ref": "#/components/schemas/LaravelPagingSchema"
          },
          {
            "properties": {
              "data": {
                "title": "Data",
                "type": "array",
                "description": "Data wrapper",
                "items": {
                  "$ref": "#/components/schemas/AuditLogSchema"
                }
              }
            }
          }
        ]
      },
      "CompaniesSchema": {
        "title": "Companies",
        "description": "Companies",
        "xml": {
          "name": "CompaniesSchema"
        },
        "allOf": [
          {
            "$ref": "#/components/schemas/LaravelPagingSchema"
          },
          {
            "properties": {
              "data": {
                "title": "Data",
                "type": "array",
                "description": "Data wrapper",
                "items": {
                  "$ref": "#/components/schemas/CompanySchema"
                }
              }
            }
          }
        ]
      },
      "CompanySchema": {
        "title": "Company",
        "type": "object",
        "properties": {
          "rn": {
            "type": "integer",
            "example": 15
          },
          "id": {
            "type": "integer",
            "example": 628
          },
          "ent_id": {
            "type": "string",
            "example": "2015925185"
          },
          "refper": {
            "type": "string",
            "example": "2017A1"
          },
          "reporting_id": {
            "type": "string",
            "example": "8001585992"
          },
          "alpha": {
            "type": "string",
            "example": "167206"
          },
          "naics": {
            "type": "string"
          },
          "unit_type": {
            "type": "string",
            "example": "MU"
          },
          "level_type": {
            "type": "string",
            "example": "c"
          },
          "name1": {
            "type": "string",
            "example": "KAISER FOODS INC"
          },
          "name2": {
            "type": "string"
          },
          "street": {
            "type": "string",
            "example": "500 YORK STREET"
          },
          "city": {
            "type": "string",
            "example": "CINCINNATI"
          },
          "state": {
            "type": "string",
            "example": "OH"
          },
          "zip": {
            "type": "string",
            "example": "452140000"
          },
          "created_by": {
            "type": "string",
            "example": "DATALOAD"
          },
          "created_date": {
            "type": "string",
            "format": "date-time",
            "example": "2022-06-09T19:28:27Z"
          },
          "last_modified_by": {
            "type": "string",
            "example": "DATALOAD"
          },
          "last_modified_date": {
            "type": "string",
            "format": "date-time",
            "example": "2022-06-09T19:28:27Z"
          }
        },
        "description": "Company"
      },
      "DataFlagsSchema": {
        "title": "Source Flags",
        "type": "object",
        "properties": {
          "data": {
            "title": "Data",
            "type": "array",
            "description": "Data wrapper",
            "items": {
              "$ref": "#/components/schemas/DataFlag"
            }
          }
        }
      },
      "DataVersionsSchema": {
        "title": "Source Flags",
        "type": "object",
        "properties": {
          "data": {
            "title": "Data",
            "type": "array",
            "description": "Data wrapper",
            "items": {
              "$ref": "#/components/schemas/DataVersion"
            }
          }
        }
      },
      "MappingsSchema": {
        "title": "Source Flags",
        "type": "object",
        "properties": {
          "data": {
            "title": "Data",
            "type": "array",
            "description": "Data wrapper",
            "items": {}
          }
        }
      },
      "SourceFlagsSchema": {
        "title": "Source Flags",
        "type": "object",
        "properties": {
          "data": {
            "title": "Data",
            "type": "array",
            "description": "Data wrapper",
            "items": {
              "$ref": "#/components/schemas/SourceFlag"
            }
          }
        }
      },
      "LaravelPagingSchema": {
        "title": "Laravel Paging Links Schema",
        "type": "object",
        "properties": {
          "links": {
            "$ref": "#/components/schemas/PagingLinksSchema"
          },
          "meta": {
            "$ref": "#/components/schemas/PagingMetaSchema"
          }
        },
        "description": "Paging Links Schema",
        "xml": {
          "name": "LaravelPagingSchema"
        }
      },
      "PagingLinksSchema": {
        "title": "Paging Links Schema",
        "type": "object",
        "properties": {
          "first": {
            "type": "string",
            "example": "https://{domain}/{endpoint}?page=1"
          },
          "last": {
            "type": "string",
            "example": "https://{domain}/{endpoint}?page=1"
          },
          "prev": {
            "type": "string",
            "example": "https://{domain}/{endpoint}?page=1"
          },
          "next": {
            "type": "string",
            "example": "https://{domain}/{endpoint}?page=1"
          }
        },
        "description": "Paging Links Schema",
        "xml": {
          "name": "PagingLinksSchema"
        }
      },
      "PagingMetaSchema": {
        "title": "Paging Meta Schema",
        "type": "object",
        "properties": {
          "current_page": {
            "type": "integer",
            "example": 2
          },
          "from": {
            "type": "integer",
            "example": 16
          },
          "last_page": {
            "type": "integer",
            "example": 5
          },
          "links": {
            "type": "array",
            "example": [
              {
                "url": "https://{domain}/{endpoint}?page=1",
                "label": "&laquo; Previous",
                "active": false
              },
              {
                "url": "https://{domain}/{endpoint}?page=1",
                "label": "1",
                "active": false
              },
              {
                "url": "https://{domain}/{endpoint}?page=2",
                "label": "2",
                "active": true
              },
              {
                "label": "Next &raquo;",
                "active": false
              }
            ],
            "items": {
              "$ref": "#/components/schemas/PagingMetaSchema_links"
            }
          },
          "path": {
            "type": "string",
            "example": "https://localhost:8443/solar-atom-acronyms/backend/api/acronyms"
          },
          "per_page": {
            "type": "integer",
            "example": 15
          },
          "to": {
            "type": "integer",
            "example": 25
          },
          "total": {
            "type": "integer",
            "example": 200
          }
        },
        "description": "Paging Meta Schema",
        "xml": {
          "name": "PagingMetaSchema"
        }
      },
      "NaicsListSchema": {
        "title": "NAICS List",
        "type": "object",
        "properties": {
          "data": {
            "title": "Data",
            "type": "array",
            "description": "Data wrapper",
            "items": {
              "$ref": "#/components/schemas/NaicsSchema"
            }
          }
        },
        "description": "NAICS List",
        "xml": {
          "name": "NaicsListSchema"
        }
      },
      "NaicsSchema": {
        "title": "NAICS",
        "type": "object",
        "properties": {
          "naics": {
            "type": "string",
            "example": "522220"
          },
          "title": {
            "type": "string",
            "example": "Sales Financing"
          }
        },
        "description": "NAICS"
      },
      "ResponseVariableSchema": {
        "title": "Response Variable",
        "type": "object",
        "properties": {
          "rvid": {
            "type": "integer",
            "example": 845
          },
          "rvname": {
            "type": "string",
            "example": "RCPT_TOT"
          },
          "rv_description": {
            "type": "string",
            "example": "Total Sales, Shipments, Receipts or Revenue"
          },
          "mu_flag": {
            "type": "string",
            "description": "Can be either YES or NO",
            "example": "YES"
          },
          "kau_flag": {
            "type": "string",
            "description": "Can be either YES or NO",
            "example": "NO"
          },
          "estab_flag": {
            "type": "string",
            "description": "Can be either YES or NO",
            "example": "YES"
          },
          "qdm_flag": {
            "type": "string",
            "description": "Can be either YES or NO",
            "example": "NO"
          }
        },
        "description": "Response Variable"
      },
      "ResponseVariablesSchema": {
        "title": "Response Variables",
        "description": "Response Variables",
        "xml": {
          "name": "ResponseVariablesSchema"
        },
        "allOf": [
          {
            "$ref": "#/components/schemas/LaravelPagingSchema"
          },
          {
            "properties": {
              "data": {
                "title": "Data",
                "type": "array",
                "description": "Data wrapper",
                "items": {
                  "$ref": "#/components/schemas/ResponseVariableSchema"
                }
              }
            }
          }
        ]
      },
      "SurveyDetailArchiveSchema": {
        "title": "Survey Detail Archive",
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "example": 1
          },
          "reporting_id": {
            "type": "integer",
            "example": 2004882785
          },
          "refper": {
            "type": "string",
            "example": "2017A1"
          },
          "rvid": {
            "type": "integer",
            "example": 347
          },
          "data_version": {
            "type": "string",
            "example": "AC"
          },
          "data_version_value": {
            "type": "string",
            "example": "608000"
          },
          "data_flag": {
            "type": "string",
            "example": "R"
          },
          "source_flag": {
            "type": "string",
            "example": "N"
          },
          "note": {
            "type": "string",
            "example": "This is a note"
          },
          "created_by": {
            "type": "string",
            "example": "lafle004"
          },
          "created_date": {
            "type": "string",
            "format": "date-time"
          },
          "last_modified_by": {
            "type": "string",
            "example": "lafle004"
          },
          "last_modified_date": {
            "type": "string",
            "format": "date-time"
          }
        },
        "description": "Survey Detail Archive"
      },
      "SurveyDetailArchivesSchema": {
        "title": "Survey Detail Archives",
        "description": "Survey Detail Archives",
        "allOf": [
          {
            "$ref": "#/components/schemas/LaravelPagingSchema"
          },
          {
            "properties": {
              "data": {
                "title": "Data",
                "type": "array",
                "description": "Data wrapper",
                "items": {
                  "$ref": "#/components/schemas/SurveyDetailArchiveSchema"
                }
              }
            }
          }
        ]
      },
      "SurveyDetailSchema": {
        "title": "Survey Detail",
        "type": "object",
        "properties": {
          "rn": {
            "type": "integer",
            "example": 1
          },
          "id": {
            "type": "integer",
            "example": 1
          },
          "ent_id": {
            "type": "string",
            "example": "2007777951"
          },
          "refper": {
            "type": "string",
            "example": "2017A1"
          },
          "reporting_id": {
            "type": "string",
            "example": "2800432703"
          },
          "alpha": {
            "type": "string",
            "example": "390801"
          },
          "sector": {
            "type": "string",
            "example": "52"
          },
          "naics": {
            "type": "string",
            "example": "523920"
          },
          "unit_type": {
            "type": "string",
            "example": "MU"
          },
          "level_type": {
            "type": "string",
            "example": "e"
          },
          "rvid": {
            "type": "string",
            "example": "347"
          },
          "rvname": {
            "type": "string",
            "example": "PAY_ANN"
          },
          "rv_value": {
            "type": "string",
            "example": "608)000"
          },
          "type_of_tax": {
            "type": "string"
          },
          "rv_description": {
            "type": "string",
            "example": "Annual Payroll Total"
          },
          "rv_version": {
            "type": "string"
          },
          "qdm_flag": {
            "type": "string",
            "example": "YES"
          }
        },
        "description": "Survey Detail"
      },
      "SurveyDetailVersionSchema": {
        "title": "Survey Detail Version",
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "example": 864661
          },
          "reporting_id": {
            "type": "integer",
            "example": 2800432703
          },
          "refper": {
            "type": "string",
            "example": "2017A1"
          },
          "rvid": {
            "type": "integer",
            "example": 347
          },
          "type_of_tax": {
            "type": "string"
          },
          "code": {
            "type": "string",
            "example": "FN"
          },
          "title": {
            "type": "string",
            "example": "Final"
          },
          "rv_value": {
            "type": "string",
            "example": "608)000"
          },
          "item_flag_id": {
            "type": "string"
          }
        },
        "description": "Survey Detail Version"
      },
      "SurveyDetailWithVersionsSchema": {
        "title": "Survey Detail",
        "type": "object",
        "properties": {
          "rn": {
            "type": "integer",
            "example": 1
          },
          "id": {
            "type": "integer",
            "example": 1
          },
          "ent_id": {
            "type": "string",
            "example": "2007777951"
          },
          "refper": {
            "type": "string",
            "example": "2017A1"
          },
          "reporting_id": {
            "type": "string",
            "example": "2800432703"
          },
          "alpha": {
            "type": "string",
            "example": "390801"
          },
          "sector": {
            "type": "string",
            "example": "52"
          },
          "naics": {
            "type": "string",
            "example": "523920"
          },
          "unit_type": {
            "type": "string",
            "example": "MU"
          },
          "level_type": {
            "type": "string",
            "example": "e"
          },
          "rvid": {
            "type": "string",
            "example": "347"
          },
          "rvname": {
            "type": "string",
            "example": "PAY_ANN"
          },
          "rv_value": {
            "type": "string",
            "example": "608)000"
          },
          "type_of_tax": {
            "type": "string"
          },
          "rv_description": {
            "type": "string",
            "example": "Annual Payroll Total"
          },
          "rv_version": {
            "type": "string"
          },
          "qdm_flag": {
            "type": "string",
            "example": "YES"
          },
          "versions": {
            "$ref": "#/components/schemas/SurveyDetailVersionSchema"
          }
        },
        "description": "Survey Detail"
      },
      "SurveyDetailsSchema": {
        "title": "Survey Details",
        "type": "object",
        "properties": {
          "data": {
            "title": "Data",
            "type": "array",
            "description": "Data wrapper",
            "items": {
              "$ref": "#/components/schemas/SurveyDetailSchema"
            }
          }
        },
        "description": "Survey Details",
        "xml": {
          "name": "SurveyDetailsSchema"
        }
      },
      "SurveyDetailsWithVersionsSchema": {
        "title": "Survey Details With Versions",
        "type": "object",
        "properties": {
          "data": {
            "title": "Data",
            "type": "array",
            "description": "Data wrapper",
            "items": {
              "$ref": "#/components/schemas/SurveyDetailWithVersionsSchema"
            }
          }
        },
        "description": "Survey Details With Versions",
        "xml": {
          "name": "SurveyDetailsWithVersionsSchema"
        }
      },
      "VUnitLevelCountSchema": {
        "title": "Unit Level Count",
        "type": "object",
        "properties": {
          "ent_id": {
            "type": "string",
            "example": "2017250643"
          },
          "alpha": {
            "type": "string",
            "example": "187639"
          },
          "unit_type": {
            "type": "string",
            "example": "mu"
          },
          "level_json": {
            "type": "array",
            "format": "array",
            "example": [
              {
                "LEVEL_TYPE": "c",
                "CNT": 5
              },
              {
                "LEVEL_TYPE": "d",
                "CNT": 8
              },
              {
                "LEVEL_TYPE": "e",
                "CNT": 10
              }
            ],
            "items": {
              "$ref": "#/components/schemas/VUnitLevelCountSchema_level_json"
            }
          }
        },
        "description": "Unit Level Count"
      },
      "QuestionSchema": {
        "title": "AYX Question Response",
        "type": "array",
        "description": "AYX Question Response",
        "items": {
          "$ref": "#/components/schemas/QuestionSchema_inner"
        }
      },
      "QueueJobModelSchema": {
        "title": "AYX Queue Job Model Schema",
        "type": "object",
        "properties": {
          "questions": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/QueueJobModelSchema_questions"
            }
          },
          "priority": {
            "type": "string",
            "example": "0"
          }
        },
        "description": "AYX Queue Job Model Schema"
      },
      "QueueJobResponse": {
        "title": "Queue Job Response",
        "properties": {
          "id": {
            "type": "string",
            "example": ""
          },
          "appId": {
            "type": "string",
            "example": ""
          },
          "createDate": {
            "type": "string",
            "example": ""
          },
          "status": {
            "type": "string",
            "example": ""
          },
          "disposition": {
            "type": "string",
            "example": ""
          },
          "outputs": {
            "type": "object",
            "example": {}
          },
          "messages": {
            "type": "object",
            "example": {}
          },
          "priority": {
            "type": "string",
            "example": ""
          },
          "workerTag": {
            "type": "string",
            "example": ""
          },
          "runWithE2": {
            "type": "boolean",
            "example": false
          }
        },
        "description": "Queue Job Response"
      },
      "WorkflowStatusSchema": {
        "title": "WorkflowStatusSchema",
        "type": "array",
        "description": "WorkflowStatusSchema",
        "items": {
          "$ref": "#/components/schemas/WorkflowStatusSchema_inner"
        }
      },
      "SubscriptionSchema": {
        "title": "Subscription Schema",
        "properties": {
          "id": {
            "type": "string",
            "example": "62c87c248751a82d3c9d2448"
          },
          "subscriptionId": {
            "type": "string",
            "example": "62c868818751a82d3c9d1ff5"
          },
          "public": {
            "type": "boolean",
            "example": false
          },
          "unit_type": {
            "type": "string",
            "example": "mu"
          },
          "runDisabled": {
            "type": "boolean",
            "example": false
          },
          "packageType": {
            "type": "string",
            "example": ""
          },
          "uploadDate": {
            "type": "string",
            "example": "Date"
          },
          "fileName": {
            "type": "string",
            "example": "Sample_Rules_App_Dropdown.yxwz"
          },
          "metaInfo": {
            "$ref": "#/components/schemas/SubscriptionSchema_metaInfo"
          },
          "isChained": {
            "type": "boolean",
            "example": false
          },
          "version": {
            "type": "integer",
            "example": 1
          },
          "runCount": {
            "type": "integer",
            "example": 3
          },
          "workerTag": {
            "type": "string",
            "example": ""
          },
          "isE2": {
            "type": "boolean",
            "example": false
          }
        },
        "description": "Subscription Schema"
      },
      "VUnitLevelCountsSchema": {
        "title": "Unit Level Counts",
        "type": "object",
        "properties": {
          "data": {
            "title": "Data",
            "type": "array",
            "description": "Data wrapper",
            "items": {
              "$ref": "#/components/schemas/VUnitLevelCountSchema"
            }
          }
        },
        "description": "Unit Level Counts",
        "xml": {
          "name": "VUnitLevelCountsSchema"
        }
      },
      "QueueJobRequest": {
        "title": "QueueJobRequest",
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "example": "Drop Down (13)"
          },
          "type": {
            "type": "string",
            "example": "QuestionListBox"
          },
          "description": {
            "type": "string",
            "example": "Select the Rule you would like to apply to the dataset, then hit \\\"Run\\\" to execute"
          },
          "items": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/QueueJobRequest_items"
            }
          },
          "multiple": {
            "type": "string",
            "description": "Can be either 'True' or 'False'",
            "example": "False"
          }
        }
      },
      "companiesexport_user": {
        "type": "object",
        "properties": {
          "jbondid": {
            "type": "string",
            "example": "bndid001"
          },
          "email": {
            "type": "string",
            "example": "jbondid@census.gov"
          }
        },
        "description": "An array contains user information. user['jbondid'] and user['email'] are required"
      },
      "companies_export_body": {
        "required": [
          "user"
        ],
        "type": "object",
        "properties": {
          "user": {
            "$ref": "#/components/schemas/companiesexport_user"
          },
          "sortBy": {
            "type": "string",
            "example": "state"
          },
          "sortDesc": {
            "type": "boolean",
            "example": true
          },
          "filters": {
            "type": "object",
            "example": {
              "ent_id": "201",
              "state": "AZ"
            }
          },
          "formatType": {
            "type": "string",
            "description": "Can be either of: csv, xlsx",
            "example": "csv"
          }
        }
      },
      "inline_response_200": {
        "type": "object",
        "properties": {
          "total": {
            "type": "integer",
            "example": 3
          }
        }
      },
      "MappingBulkUpsertRequest_source_flags": {
        "type": "object",
        "properties": {
          "": {
            "type": "integer",
            "example": 1
          }
        }
      },
      "PagingMetaSchema_links": {
        "type": "object",
        "properties": {
          "url": {
            "type": "string",
            "example": "https://{domain}/{endpoint}?page=1"
          },
          "label": {
            "type": "string",
            "example": "Previous"
          },
          "active": {
            "type": "boolean",
            "example": true
          }
        }
      },
      "VUnitLevelCountSchema_level_json": {
        "type": "object",
        "properties": {
          "LEVEL_TYPE": {
            "type": "string",
            "example": "a"
          },
          "CNT": {
            "type": "integer",
            "example": 10
          }
        }
      },
      "QuestionSchema_inner": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "example": ""
          },
          "type": {
            "type": "string",
            "example": ""
          },
          "description": {
            "type": "string",
            "example": ""
          },
          "value": {
            "type": "string",
            "example": ""
          },
          "items": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "key": {
                  "type": "string",
                  "example": ""
                },
                "value": {
                  "type": "string",
                  "example": ""
                }
              }
            }
          },
          "multiple": {
            "type": "boolean",
            "example": false
          }
        }
      },
      "QueueJobModelSchema_questions": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "example": "Drop Down (13)"
          },
          "value": {
            "type": "string",
            "example": "A"
          },
          "notes": {
            "type": "string",
            "example": "Paste the array response from list-questions endpoint as value for questions"
          }
        }
      },
      "WorkflowStatusSchema_inner": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "example": ""
          },
          "createDate": {
            "type": "string",
            "example": "2022-07-08T18:55:38.091Z"
          },
          "status": {
            "type": "string",
            "example": ""
          },
          "disposition": {
            "type": "string",
            "example": ""
          },
          "priority": {
            "type": "string",
            "example": ""
          },
          "workerTag": {
            "type": "string",
            "example": ""
          },
          "runWithE2": {
            "type": "boolean",
            "example": false
          }
        }
      },
      "SubscriptionSchema_metaInfo": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "example": "Sample_Rules_App_Dropdown"
          },
          "description": {
            "type": "string",
            "example": "Use this App to update the specific data source with the available rules listed. When executed, the updated data will feed the respective dashboard for further viewing. Select RUN to continue."
          },
          "author": {
            "type": "string",
            "example": "CENSUS DEPT"
          },
          "copyright": {
            "type": "string",
            "example": ""
          },
          "url": {
            "type": "string",
            "example": ""
          },
          "urlText": {
            "type": "string",
            "example": ""
          },
          "outputMessage": {
            "type": "string",
            "example": "You have successfully run the rules engine.  The data has updated in the respective dashboard and may be viewed there now. Additionally, you may preview the results below"
          },
          "noOutputFilesMessage": {
            "type": "string",
            "example": ""
          }
        }
      },
      "QueueJobRequest_items": {
        "type": "object",
        "properties": {
          "key": {
            "type": "string",
            "example": "RULE_1 - If RV1 ne RV2+RV3, then set RV1 = RV2+RV3"
          },
          "value": {
            "type": "string",
            "example": "A"
          }
        }
      },
      "RulesConditionValidationRequest": {
        "title": "Rules Condition Validation Request",
        "required": ["facts", "conditionstring"],
        "type": "object",
        "properties": {
          "facts": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "conditionstring": {
            "type": "string"
          }
        }
      }
    },
    "parameters": {
      "general--api_token": {
        "name": "api_token",
        "in": "query",
        "description": "API Token (Auth alternative to Census SID. Contact an Administrator)",
        "required": false,
        "style": "form",
        "explode": true,
        "schema": {
          "type": "string"
        }
      },
      "vuetify--page": {
        "name": "page",
        "in": "query",
        "description": "Indicate what page.",
        "required": false,
        "style": "form",
        "explode": true,
        "schema": {
          "type": "integer"
        }
      },
      "vuetify--itemsPerPage": {
        "name": "itemsPerPage",
        "in": "query",
        "description": "Indicate how many result per page. -1 for all",
        "required": false,
        "style": "form",
        "explode": true,
        "schema": {
          "type": "integer"
        }
      },
      "vuetify--sortBy": {
        "name": "sortBy[]",
        "in": "query",
        "description": "Name of property which you would like to sort on",
        "required": false,
        "style": "form",
        "explode": true,
        "schema": {
          "type": "string"
        }
      },
      "vuetify--sortDesc": {
        "name": "sortDesc[]",
        "in": "query",
        "description": "Sorting the property in sorbBy in Desc. True/False",
        "required": false,
        "style": "form",
        "explode": true,
        "schema": {
          "type": "string"
        }
      },
      "vuetify--filters": {
        "name": "filters",
        "in": "query",
        "description": "Filters. List of Column-Value pair that help refine our search results. Currently interpreted as 'starts like' ",
        "required": false,
        "style": "form",
        "explode": true,
        "schema": {
          "type": "string",
          "example": "{\"column_name\":\"value\",\"name\":\"WAL\"}"
        }
      }
    }
  }
}

module.exports = jsonData