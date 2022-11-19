# React XState interpreter

A simple function that use XState like a RXjs Observable.

<br/>

## Short introduction

<br/>

### [Xstate](https://xstate.js.org/docs/)

XState is a implementation of
**[Statecharts](https://pdf.sciencedirectassets.com/271600/1-s2.0-S0167642300X00603/1-s2.0-0167642387900359/main.pdf?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBUaCXVzLWVhc3QtMSJHMEUCIEB%2FNdTHRam3xNVGmmPL0%2FayP3NvYHO1D8sj4SWPQ3OcAiEAt5CmjX%2F2aG%2FKnGT66QvIP3a3NcRX8wEKqwlhshUUGrwqzAQIHhAFGgwwNTkwMDM1NDY4NjUiDMXwLhKk1sRLhyhfOSqpBEIPiTot8g1J8zdeJCNgjWtrMa0S%2Bknjzcu9xSHr%2FdVgAxZOC0bOMXquOvW9xObg44pb4UqMojiE%2FodGJTkkvFMPjOEaeXgcmo2XQVwXpHbraWx%2BE5VYcIV9bucK%2FdWoAXWHo40MPCeInyZBbQKl2GPCsCYEzocuDZjvOoaM6VZde5Z6jvJWn%2FA5v3NkpI7V0oCTf6KZ%2FxnH3A8lfrA1Bmhi3itU2XOFF0LrrzH2qyuSR2JtfxUcb1sxfLUGGV8eBQfESDJqBx7L%2FdUsl9Ce%2B4u6e5SaNA01cxoeY%2B0DMlOI2fZNgIKYs%2FUHNmlwrHMPLIEL7Z3jy3bu2kVGafnVPFYc%2FeDUW78nwWcJ%2BW%2BKuxspY5gznbpUN7zBNPkvDP5XdpsWSEPFmnhqapJBK1aaeoMEskW7vbIgpDUCZY2D527Yus%2B1TefQHm38YJxTskSw%2FicxSkeq3ABQxG7Fwn9VkttCTsOLvTFkuJl4thvlx0WIUdwS13PmPK9VEgemABvZMJvVy3z1tudu3agS8q6K%2BcQnBB4B9IhpRIukJAAheOKfrMaTKTdU93iDilW6AnIuZ2dKsHynnfnfNsxwC%2BD6hnuZoXAhaIUcff5hR7vHX6toZNHUS%2BFSkkrcA0%2FxgIss5gbmkabeQyfOssWwc30Bxk6i6bfTGC8j7Rvd3bAsmos6fZRWN8%2BNk0sYrhvJYj4pAvNkpCYGq15VeOg2GVQk7wCFqPW7HYm%2FZbQwno3VmwY6qQE7vSGyeB6%2Bmd%2FcEQ27oKW%2BgWDKHB5xL%2B8cEK4MX96H5P8abhXcWjyvxIJvNJVAMbTb7DT0GcOSJFhIPImoJWIHjapfCQxmGYb0oShHzTP%2FbN5LK0EJOKVXiyvX%2BYywO0XG43terk0jyy1ZpGXyLNp08pVB4VhUg5lWsnKzrJAmRVF7EzIG8Bjs5TvcN4j61EIs26X4AgEvOy10PvYG4S9aaK00NR9vFVA9&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20221116T215907Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=ASIAQ3PHCVTY2MTPPP4O%2F20221116%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=e38488438afd037f4d7de8bd8c6e071df44e6d26ff23ba61e79928a00f024fda&hash=1d4916fd19d0ddcc9b139fe8d9c5052866814462f95b805f093f9a4d47b8a745&host=68042c943591013ac2b2430a89b270f6af2c76d8dfd086a07176afe7c76c2c61&pii=0167642387900359&tid=spdf-c523505d-2eea-4eae-9af4-1ae83f797e0d&sid=f2a0ff886e08b945ac4ab6570af7d8e4159bgxrqb&type=client&ua=51550752590b00010157&rr=76b37defb947f840)**,
a graphical way to represent complexity in code.

<br/>

### Problems

1. Complexity of React context :

> When hooks were introduced, everyone was very happy. But with useState
and useReducer, you cannot share data between components. So you need
another function : createContext. But it cames with some complexity.
So the “createContext” function returns a component named Provider.
You need to wrap all components inside the Provider so you can use
another hook “useContext”. Again three steps to share just a variable.
It appears that it add more complexity than solutions.

2. Recommend way to use XState globally :

- In XState [docs](google.com), it’s recommended to use react context to
  have a global service shareable between components. The procedure is
  tedious but it works like a charm.
- Statecharts are usually big and has can have compound states, with many
  events. So it’s unusual to use it only in one component.

3. Version 13 of Next.js :
> The new <u>app</u> directory contains only server components by
default. To use react context, you need to mark the component as
_client component_. So the upper in the stack a client component is
added, the harder you lose the benefits of SSR.

<br/>

## The solution

Just a simple function reactInterpret. It’s a hook creator and function
generator.

### It accepts the same arguments as XState function *[interpret](https://xstate.js.org/docs/guides/interpretation.html#interpreter)*.

<br/>

It returns some functions :

```json
{
  "start": "Start the interpreter (The same as Xstate Interpreter)",
  "stop": "Stop the interpreter (The same as Xstate Interpreter)",
  "send": "Send Event to the machine (The same as Xstate Interpreter)",
  "sender": {
    "definition": "A new way to simplify sending events",
    "example": {
      "event": {
        "type": "INPUT",
        "input": "string"
      },
      "prepareFunction": "const mySend = sender('INPUT')",
      "usage": "mySend({ input: 'name' })"
    }
  },
  "createSelector": "Create selector for hooks"
  /* ... */
}
```

, and hooks :

```json
{
  "useSelector": "Select an element inside the current state (The same as Xstate hook but without the last parameter).",
  "useMatches": "Macther for the value of the current state (not from XState, derived from @bemedev/x-matches).",
  "useHasTags": "Macther for tags of current value. Accept param array."
}
```

**NB** : Check the Library : _[@bemedev/x-matches](https://www.npmjs.com/package/@bemedev/x-matches)_ to see how ***useMatches*** works.

### Live documentation [here](https://github.com/chlbri/x-interpret-react/blob/master/src/index.test.ts)

<br>
<br>

_Enjoy your [function](https://github.com/chlbri/x-matches)_ ✌🏾😎 _!_
