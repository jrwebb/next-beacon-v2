# n-keen-query
Extended keen-query for next

`npm install -g Financial-Times/n-keen-query`

Make sure you have `KEEN_READ_KEY` and `KEEN_PROJECT_ID` env vars set

**Warning - This isn't versioned yet (as it'd make developing beacon, keen-query and n-keen-query in parallel more difficult). The syntax is quite experimental and subject to change**

## Extended API

In addition to the shorthand query syntax of [keen-query](https://github.com/Financial-Times/keen-query) This module defines a few next specific things

All queries exclude staff by default. To include them add `->raw()` to your query string

- `->subs()` return data for subscribers only
- `->anon()` return data for anonymous users only

PRs welcome for additional shorthands, though only for ones aimed at data in the [new keen instance](https://dashboard.heroku.com/apps/ft-next-beacon-v2/resources)

*Note - for the time being they all work with the current keen instance. A new cleaned up keen & beacon is [in the works](https://dashboard.heroku.com/apps/ft-next-beacon-v2/resources) with a different data structure, so eventually some of the aliases defined here won't work in the old keen*


## Aliasing

Aliases for keen-queries are defined in a [spreadsheet](https://docs.google.com/spreadsheets/d/1jH15yE5T6omD-B58UJfu1y4j8qN4QIs17u-52_Jkw7M/edit#gid=0)

Adding an alias here does a few things

- adds it to the list  returned by `kq alias`
- means the query is runnable using `kq alias aliasName`
- means (eventually) the query will be picked up by beacon v2

