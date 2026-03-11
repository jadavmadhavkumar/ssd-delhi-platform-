/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as articles from "../articles.js";
import type * as blogs from "../blogs.js";
import type * as dashboard from "../dashboard.js";
import type * as events from "../events.js";
import type * as media from "../media.js";
import type * as news from "../news.js";
import type * as seed from "../seed.js";
import type * as timeline from "../timeline.js";
import type * as users from "../users.js";
import type * as verifySeed from "../verifySeed.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  articles: typeof articles;
  blogs: typeof blogs;
  dashboard: typeof dashboard;
  events: typeof events;
  media: typeof media;
  news: typeof news;
  seed: typeof seed;
  timeline: typeof timeline;
  users: typeof users;
  verifySeed: typeof verifySeed;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
