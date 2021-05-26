# I Learned Bezier Curves
I did a bit of learning about beziers and how to use them today, turns out they're really dang simple
So this is a program that allows you to control a cubic bezier curve, it's called cubic because the formula used to create it has a t-cubed(t^3) in it.

Check out a **working example** at [https://i-learned-bezier-curves.netlify.app/](https://i-learned-bezier-curves.netlify.app/)

## Analysis
From my learning of beziers I noticed there's really two parts to understand.
1. Why do they work, what is the intuition?
2. How to implement them in code + in practice.

Another interesting find I had was that the multiplication of each of the points follows the binomial theorem format of (a+b)ⁿ. For quadratic beziers the formula is **(1-t)²** * L1(t) + **(1-t) * (t)** * L2(t) + **(t)²** * L3(t).

I wouldn't be able to type out the cubic formula in a simplistic fashion as I did for the quadratic one, but if you understand the binomial theorem, and you've seen the simplified cubic equation formula, then hopefully you see the correlation I'm trying to present.

And that's about all I analyzed in search of Bezier curves.

## Learn For Yourself

If you want to learn bezier curves, check out this cool tutorial online [Bezier Curves Explained](https://www.youtube.com/watch?v=pnYccz1Ha34&t=55s). Trust me it's super high quality and the animations are really helpful in understanding the many cases of beziers, not just the cubic ones.