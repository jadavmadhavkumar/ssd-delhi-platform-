## Error Type
Console Error

## Error Message
In HTML, <a> cannot be a descendant of <a>.
This will cause a hydration error.

  ...
    <NavigationMenuCollectionSlot.Slot ref={function}>
      <NavigationMenuCollectionSlot.SlotClone ref={function}>
        <Primitive.div dir="ltr" asChild={true} ref={function}>
          <Primitive.div.Slot dir="ltr" ref={function}>
            <Primitive.div.SlotClone dir="ltr" ref={function}>
              <Primitive.ul data-orientation="horizontal" data-slot="navigation..." className="group flex..." ...>
                <ul data-orientation="horizontal" data-slot="navigation..." className="group flex..." dir="ltr" ...>
                  <NavigationMenuItem>
                    <NavigationMenuItem data-slot="navigation..." className="relative">
                      <NavigationMenuItemProvider scope={undefined} value="radix-_R_1..." triggerRef={{current:null}} ...>
                        <Primitive.li data-slot="navigation..." className="relative" ref={null}>
                          <li data-slot="navigation..." className="relative" ref={null}>
                            <LinkComponent href="/">
>                             <a
>                               ref={function}
>                               onClick={function onClick}
>                               onMouseEnter={function onMouseEnter}
>                               onTouchStart={function onTouchStart}
>                               href="/"
>                             >
                                ...
                                  <Primitive.button.Slot onKeyDown={function handleEvent} data-radix-collection-item="" ...>
                                    <Primitive.button.SlotClone onKeyDown={function handleEvent} ...>
                                      <Primitive.a data-active={undefined} aria-current={undefined} ...>
>                                       <a
>                                         data-active={undefined}
>                                         aria-current={undefined}
>                                         data-slot="navigation-menu-link"
>                                         className={"data-[active=true]:focus:bg-accent data-[active=true]:hover:bg-..."}
>                                         onClick={function handleEvent}
>                                         onKeyDown={function handleEvent}
>                                         data-radix-collection-item=""
>                                         ref={function}
>                                       >
                  ...



    at a (<anonymous>:null:null)
    at NavigationMenuLink (src/components/ui/navigation-menu.tsx:129:5)
    at <unknown> (src/components/header.tsx:120:23)
    at Array.map (<anonymous>:null:null)
    at Header (src/components/header.tsx:91:29)
    at RootLayout (src/app/layout.tsx:40:13)

## Code Frame
  127 | }: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  128 |   return (
> 129 |     <NavigationMenuPrimitive.Link
      |     ^
  130 |       data-slot="navigation-menu-link"
  131 |       className={cn(
  132 |         "data-[active=true]:focus:bg-accent data-[active=true]:hover:bg-accent data-[active=true]:bg-accent/50 data-[active=true]:text-accent-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:ring-ring/50 [&_svg:not([class*='text-'])]:text-muted-foreground flex flex-col gap-1 rounded-sm p-2 text-sm transition-all outline-none focus-visible:ring-[3px] focus-visible:outline-1 [&_svg:not([class*='size-'])]:size-4",

Next.js version: 16.1.6 (Turbopack)


## Error Type
Console Error

## Error Message
<a> cannot contain a nested <a>.
See this log for the ancestor stack trace.


    at a (<anonymous>:null:null)
    at <unknown> (src/components/header.tsx:119:21)
    at Array.map (<anonymous>:null:null)
    at Header (src/components/header.tsx:91:29)
    at RootLayout (src/app/layout.tsx:40:13)

## Code Frame
  117 |                     </>
  118 |                   ) : (
> 119 |                     <Link href={item.href}>
      |                     ^
  120 |                       <NavigationMenuLink
  121 |                         className={cn(
  122 |                           navigationMenuTriggerStyle(),

Next.js version: 16.1.6 (Turbopack)


## Error Type
Recoverable Error

## Error Message
Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used:

- A server/client branch `if (typeof window !== 'undefined')`.
- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
- Date formatting in a user's locale which doesn't match the server.
- External changing data without sending a snapshot of it along with the HTML.
- Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

https://react.dev/link/hydration-mismatch


    at a (<anonymous>:null:null)
    at NavigationMenuLink (src/components/ui/navigation-menu.tsx:129:5)
    at <unknown> (src/components/header.tsx:120:23)
    at Array.map (<anonymous>:null:null)
    at Header (src/components/header.tsx:91:29)
    at RootLayout (src/app/layout.tsx:40:13)

## Code Frame
  127 | }: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  128 |   return (
> 129 |     <NavigationMenuPrimitive.Link
      |     ^
  130 |       data-slot="navigation-menu-link"
  131 |       className={cn(
  132 |         "data-[active=true]:focus:bg-accent data-[active=true]:hover:bg-accent data-[active=true]:bg-accent/50 data-[active=true]:text-accent-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:ring-ring/50 [&_svg:not([class*='text-'])]:text-muted-foreground flex flex-col gap-1 rounded-sm p-2 text-sm transition-all outline-none focus-visible:ring-[3px] focus-visible:outline-1 [&_svg:not([class*='size-'])]:size-4",

Next.js version: 16.1.6 (Turbopack)


## Error Type
Runtime Error

## Error Message
[CONVEX Q(articles:list)] [Request ID: e94789f3a16774d1] Server Error
Could not find public function for 'articles:list'. Did you forget to run `npx convex dev` or `npx convex deploy`?

  Called by client


    at HomePage (src/app/page.tsx:13:36)

## Code Frame
  11 |
  12 | export default function HomePage() {
> 13 |   const featuredArticles = useQuery(api.articles?.list as any, {
     |                                    ^
  14 |     featured: true,
  15 |     status: "published",
  16 |     limit: 3,

Next.js version: 16.1.6 (Turbopack)


