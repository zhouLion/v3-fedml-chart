import { create, format as d3Format, hierarchy } from 'd3'
import { groupBy, uniqueBy } from './array'

interface Column {
    label: string
    value: any
    format: any
    x: number
}

const defFormat = d3Format(',')

// truncate text
function truncate(str: string, num = 10) {
    if (str.length > num) {
        return `${str.slice(0, num)}...`
    }
    return str
}

function createRoot(data: any) {
    let i = 0
    return hierarchy(data).eachBefore((d: any) => (d.index = i++))
}

export function createFiletreeChart(
    data: any,
    columns: Column[] = [
        // {
        //     label: 'gpu',
        //     value: (d: any) => d.gpu,
        //     format: (value: any) => {
        //         return value
        //     },
        //     x: 280,
        // },
        {
            label: 'Count',
            value: (d: any) => ((d.children && d.children.length > 0) ? 0 : 1),
            format: (value: any, d: any) =>
                d.children ? defFormat(value) : '',
            x: 340,
        },
    ],
    nodeSize = 17,
    width = 750,
) {
    const root = createRoot(data)
    const nodes = root.descendants()

    const svg = create('svg')
        .attr('viewBox', [
            -nodeSize / 2,
            (-nodeSize * 3) / 2,
            width,
            (nodes.length + 1) * nodeSize,
        ])
        .attr('font-family', 'sans-serif')
        .attr('font-size', 10)
        .style('overflow', 'visible')

    const links = svg
        .append('g')
        .attr('fill', 'none')
        .attr('stroke', '#999')
        .selectAll('path')
        .data(root.links())
        .join('path')
        .attr(
            'd',
            (d: any) => `
          M${d.source.depth * nodeSize},${d.source.index * nodeSize}
          V${d.target.index * nodeSize}
          h${nodeSize}
        `,
        )

    const node = svg
        .append('g')
        .selectAll('g')
        .data(nodes)
        .join('g')
        .attr('transform', (d: any) => `translate(0,${d.index * nodeSize})`)

    node
        .append('circle')
        .attr('cx', d => d.depth * nodeSize)
        .attr('r', 2.5)
        .attr('fill', d => (d.children ? null : '#999'))

    node
        .append('text')
        .attr('dy', '0.32em')
        .attr('x', d => d.depth * nodeSize + 6)
        .text(d => truncate(d.data.name, 30))

    node.append('title').text(d =>
        d
            .ancestors()
            .reverse()
            .map(d => d.data.name)
            .join('/'),
    )

    for (const { label, value, format, x } of columns) {
        const textData = root.copy().sum(value).descendants()
        svg
            .append('text')
            .attr('dy', '0.32em')
            .attr('y', -nodeSize)
            .attr('x', x)
            .attr('text-anchor', 'end')
            .attr('font-weight', 'bold')
            .text(label)

        node
            .append('text')
            .attr('dy', '0.32em')
            .attr('x', x)
            .attr('text-anchor', 'end')
            .attr('fill', d => (d.children ? null : '#555'))
            .data(textData)
            .text(d => format(d.value, d))
    }

    return svg.node()
}

function mapEdges(edges: any[]) {
    return edges.map((edge: any) => {
        const { name } = edge
        return {
            ...edge,
            name,
            children: [],
        }
    })
}

export function groupEdgeBy(edges: any[], groupKey: string) {
    const groupEdges = Object.entries(groupBy(edges, groupKey))
    // .filter(([key]) => !!key)
        .map(([key, value]) => {
            return {
                name: `${groupKey}: ${key}`,
                children: value.map((edge) => {
                    return {
                        ...edge,
                        name: edge.name,
                        children: [],
                    }
                }),
            }
        })

    return groupEdges
}

export function createFiletreeData(users: any[], group: {
    name: string
}) {
    const tTreeData = {
        ...group,
        name: `GROUP NAME: ${group?.name || '-'}`,
        children: users.map((user: any) => {
            const { account, edges } = user
            const uniqueEdges = uniqueBy(edges, 'deviceid')

            return {
                ...user,
                name: account,
                children: mapEdges(uniqueEdges),
            }
        }),
    }
    return tTreeData
}

export default function init(container: HTMLElement, data: any, _options: any = {}) {
    const render = (chartData: any) => {
        const filetree = createFiletreeData(chartData.users || [], chartData.group)
        // filetree.
        const svgNode = createFiletreeChart(filetree)
        // empty container
        container.innerHTML = ''
        // append svg to container
        if (svgNode) {
            container.appendChild(svgNode)
        }
    }

    render(data)

    return {
        render,
    }
}
