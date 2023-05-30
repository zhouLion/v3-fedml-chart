/* eslint-disable @typescript-eslint/prefer-ts-expect-error */
import 'd3-transition'
import {
    create,
    hierarchy as d3Hierarchy,
    linkHorizontal as d3LinkHorizontal,
    tree as d3Tree,
} from 'd3'
import { groupBy, uniqueBy } from './array'

const [dx, dy] = [10, 192]
const margin = { top: 10, right: 120, bottom: 10, left: 40 }
const tree = d3Tree().nodeSize([dx, dy])
const diagonal = d3LinkHorizontal()
// @ts-ignore it's temp data
    .x(d => d.y)
// @ts-ignore it's temp data
    .y(d => d.x)

export interface TreeData {
    name: string
    children: TreeData[]
    [s: string]: unknown
}

export function createD3TreeChart(data: TreeData, width = 900) {
    const root = d3Hierarchy(data)

    // @ts-ignore it's temp data
    root.x0 = dy / 2
    // @ts-ignore it's temp data
    root.y0 = 0
    root.descendants().forEach((d, i) => {
    // @ts-ignore it's temp data
        d.id = i
        // @ts-ignore it's temp data
        d._children = d.children
        if (d.depth) {
            // @ts-ignore it's temp data
            d.children = null
        }
    })

    const svg = create('svg')
        .attr('viewBox', [-margin.left, -margin.top, width, dx])
        .style('font', '10px sans-serif')
        .style('user-select', 'none')

    const gLink = svg
        .append('g')
        .attr('fill', 'none')
        .attr('stroke', '#555')
        .attr('stroke-opacity', 0.4)
        .attr('stroke-width', 1.5)

    const gNode = svg
        .append('g')
        .attr('cursor', 'pointer')
        .attr('pointer-events', 'all')

    // @ts-ignore it's temp data
    function update(source) {
        const duration = 250
        const nodes = root.descendants().reverse()
        const links = root.links()

        // @ts-ignore it's temp data
        // Compute the new tree layout.
        tree(root)

        let left = root
        let right = root
        root.eachBefore((node) => {
            // @ts-ignore it's temp data
            if (node.x < left.x) {
                left = node
            }
            // @ts-ignore it's temp data
            if (node.x > right.x) {
                right = node
            }
        })
        // @ts-ignore it's temp data
        const height = right.x - left.x + margin.top + margin.bottom
        const transition = svg
            .transition()
            .duration(duration)
        // @ts-ignore it's temp data
            .attr('viewBox', [-margin.left, left.x - margin.top, width, height])
            .tween(
                'resize',
                // @ts-ignore it's temp data
                window.ResizeObserver ? null : () => () => svg.dispatch('toggle'),
            )

        // @ts-ignore it's temp data
        // Update the nodes…
        const node = gNode.selectAll('g').data(nodes, d => d.id)

        // Enter any new nodes at the parent's previous position.
        const nodeEnter = node
            .enter()
            .append('g')
            .attr('transform', () => `translate(${source.y0},${source.x0})`)
            .attr('fill-opacity', 0)
            .attr('stroke-opacity', 0)
            .on('click', (_, d) => {
                // @ts-ignore it's temp data
                d.children = d.children ? null : d._children
                update(d)
            })

        nodeEnter
            .append('circle')
            .attr('r', 2.5)
        // @ts-ignore it's temp data

            .attr('fill', d => (d._children ? '#555' : '#999'))
            .attr('stroke-width', 10)

        nodeEnter
            .append('text')
            .attr('dy', '0.31em')
        // @ts-ignore it's temp data
            .attr('x', d => (d._children ? -6 : 6))
        // @ts-ignore it's temp data
            .attr('text-anchor', d => (d._children ? 'end' : 'start'))
            .text(d => d.data.name)
            .clone(true)
            .lower()
            .attr('stroke-linejoin', 'round')
            .attr('stroke-width', 3)
            .attr('stroke', 'white')

        // Transition nodes to their new position.
        // const nodeUpdate =
        node
        // @ts-ignore it's temp data
            .merge(nodeEnter)
        // @ts-ignore it's temp data
            .transition(transition)
        // @ts-ignore it's temp data
            .attr('transform', d => `translate(${d.y},${d.x})`)
            .attr('fill-opacity', 1)
            .attr('stroke-opacity', 1)

        // Transition exiting nodes to the parent's new position.
        // const nodeExit =
        node
            .exit()
        // @ts-ignore it's temp data
            .transition(transition)
            .remove()
            .attr('transform', d => `translate(${source.y},${source.x})`)
            .attr('fill-opacity', 0)
            .attr('stroke-opacity', 0)

        // Update the links…
        // @ts-ignore it's temp data
        const link = gLink.selectAll('path').data(links, d => d.target.id)

        // Enter any new links at the parent's previous position.
        const linkEnter = link
            .enter()
            .append('path')
            .attr('d', () => {
                const o = { x: source.x0, y: source.y0 }
                // @ts-ignore it's temp data
                return diagonal({ source: o, target: o })
            })

        // Transition links to their new position.
        // @ts-ignore it's temp data
        link.merge(linkEnter).transition(transition).attr('d', diagonal)

        // Transition exiting nodes to the parent's new position.
        link
            .exit()
        // @ts-ignore it's temp data
            .transition(transition)
            .remove()
            .attr('d', () => {
                const o = { x: source.x, y: source.y }
                // @ts-ignore it's temp data
                return diagonal({ source: o, target: o })
            })

        // Stash the old positions for transition.
        root.eachBefore((d) => {
            // @ts-ignore it's temp data
            d.x0 = d.x
            // @ts-ignore it's temp data
            d.y0 = d.y
        })
    }

    update(root)

    return svg.node()
}

export function createD3TreeData(users: any[], group: Record<string, any>) {
    return (groupKey: string) => {
        const tTreeData: TreeData = {
            ...group,
            name: `GROUP NAME: ${group.name}`,
            children: users.map((user: any) => {
                const { account, edges } = user
                const uniqueEdges = uniqueBy(edges, 'deviceid')
                const groupEdges = Object.entries(groupBy(uniqueEdges, groupKey))
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
                            }).slice(0, 100),
                        }
                    })

                return {
                    ...user,
                    name: account,
                    children: groupEdges,
                }
            }),
        }
        return tTreeData
    }
}
