Working demo at [https://hermite-curve-demo.netlify.app/](https://hermite-curve-demo.netlify.app/)

# Hermite Curves
This is a modified version of the main bezier curve app that draws hermite curves instead.

I made it to try and prove whether or not you could split a hermite curve using just the tangent + split point.

My hypothesis was wrong, you cannot split a hermite curve in that fashion, you can see what I found yourself with this app using the default `t` + `weight settings`.

## What Are Hermite Curves?
They are curves determined by 2 points and 2 tangent vectors. The curve must go through both the points and the tangent vectors of the curve at those 2 points much match their corresponding tangent vectors.

So why do we want to know about hermite curves?

The tangent vector property of hermite curves relates them to bezier curves. This property is very useful when it comes to splitting a bezier curve and also helps with the intuition behind why it's easy to split them.

## Usage
To use the app there are 3 controls you have access to.
1. `t` - This is the percentage along the curve you want to split at between the range `[0, 1]`. Note
2. `weight` - This is the amount the 2 tangent vectors in both new hermite curves are divided by. For instance the tangent vector `<3, 0, 6>` at weight 3 would become `<1, 0, 2>`.
3. `Toggle overlay` - This controls whether or not to show what the 2 split curves would look like if you used the split point on the curve + its tangent to create 2 new hermite curves.

## Running
Install vite globally `npm install -g vite`
Run `vite` in the command prompt in the root folder of the project and vite will load a site on localhost for you to use.

[Learn more about Vite]https://vitejs.dev/guide/why.html)