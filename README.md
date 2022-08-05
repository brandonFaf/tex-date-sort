# TEX date sorter

## What this does

This script looks at all `*.tex` files (that don't end in `-sorted.tex`). It finds the first `\rownumber` and designates everything up to that point as the `head`. It then looks for `\end{longtable}` and taks from that to the end of the file as `tail`. It then takes every entry that starts with `\rownumber` and ends with `\\` and sorts every entry by the second row that starts with `&` Finally it concats `head` the sorted entries and `tail` and puts it in a new file with `-sorted` appended to the filename (minus the extension)

## How to run

1. [Install Deno](https://deno.land/#installation)
2. Clone repository
3. In the directory with the script run, `deno run --allow-read=. --allow-write=. index.ts`
